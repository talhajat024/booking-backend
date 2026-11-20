import { BadRequestException,ConflictException ,Injectable, NotFoundException,ForbiddenException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { Between, Not } from 'typeorm';
import {Repository} from "typeorm/repository/Repository";
import { Booking } from './booking.entity';
import {CreateBookingDto} from "./dto/create-booking.dto";
import {ServicesService} from "../services/services.service";
import {AvailabilityService} from "../availability/availability.service";
import { parseLocal,formatLocal } from './booking-time.util';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class BookingsService {

    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,
        private servicesService: ServicesService,
        private availabilityService: AvailabilityService,
        private businessesService: BusinessesService
    ) {}

    async create(customerId:number,dto:CreateBookingDto){

        const service = await this.servicesService.findById(dto.serviceId);
        if(!service){
            throw new NotFoundException("Service not found");
        }
        const start = parseLocal(dto.startTime);
        if(!start){
            throw new BadRequestException("Invalid date ot time");
        }
        const end = new Date(start.getTime() + service.durationMinutes * 60_000);

        // slot must stay within the same day
        const sameDay = formatLocal(start).slice(0,10) === formatLocal(end).slice(0,10);
      
        const hours = await this.availabilityService.findByDay(service.businessId,start.getUTCDay());

        if(!hours) throw new BadRequestException("Business is closed that day");

        // TIME columns come back as "09:00:00", so slice to "HH:MM" for comparison
        const startHM = formatLocal(start).slice(11,16);
        const endHM = formatLocal(end).slice(11,16);
        if(!sameDay || startHM < hours.startTime.slice(0,5) || endHM > hours.endTime.slice(0,5)){
            throw new BadRequestException("Slot is outside working hours");
        }

        const booking = this.bookingRepo.create({
            customerId,
            businessId:service.businessId,
            serviceId:service.id,
            startTime:formatLocal(start),
            endTime:formatLocal(end),
            status:"confirmed"
        });

        try
        {
            return await this.bookingRepo.save(booking);
        }
        catch(err)
        {
            const code = (err as { driverError?: { code?: string } }).driverError?.code;
            if(code === '23P01') 
            {
                throw new ConflictException("The slot is already booked");
            }
            throw err;
        }
    }

    findForCustomer(customerId: number) {
         return this.bookingRepo.find({
            where: { customerId },
            order: { startTime: 'ASC' },
         });
    }

    async findForBusiness(businessId: number,ownerId:number) {
        await this.businessesService.assertOwner(businessId,ownerId); 
        return this.bookingRepo.find({
            where: { businessId },
            order: { startTime: 'ASC' },
        });
    }

    async cancel(bookingId: number, user: {sub:number, role:string}) {
        const booking = await this.bookingRepo.findOne({where:{id:bookingId}});
        if(!booking) throw new NotFoundException("Booking not found");

        if(user.role === 'customer'){
            if(booking.customerId !== user.sub) throw new ForbiddenException("Not your booking");
        }
        else
        {
            await this.businessesService.assertOwner(booking.businessId,user.sub);   
        }

        if(booking.status === 'cancelled') throw new ConflictException("Booking is already cancelled");
        booking.status = 'cancelled';
        return this.bookingRepo.save(booking);

    }


    async getFreeSlots(serviceId: number, date:string){

        if (!date) throw new BadRequestException('date is required (YYYY-MM-DD)');
        const service = await this.servicesService.findById(serviceId);
        if (!service) throw new NotFoundException("Service not found");

        const day = parseLocal(`${date} 00:00`);
        if(!day) throw new BadRequestException("Invalid date");

        const hours = await this.availabilityService.findByDay(service.businessId,day.getUTCDay());
        if(!hours) return [];

        const toMin = (t:string)=> Number(t.slice(0,2)) * 60 + Number(t.slice(3,5));
        
        const hm = (m:number)=> 
            `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

        const open = toMin(hours.startTime);
        const close = toMin(hours.endTime);
        const step = service.durationMinutes;

        const booked = await this.bookingRepo.find({
            where:{
                businessId: service.businessId,
                startTime: Between(`${date} 00:00:00`, `${date} 23:59:59`),
                status: Not('cancelled'),
            },
        });

        const busy = booked.map((b) => ({
             start: toMin(b.startTime.slice(11)),
            end: toMin(b.endTime.slice(11)),
            }));

        const slots:{start:string, end:string} []=[];
        for(let m= open;m+step <= close; m+= step){
            const clash = busy.some((b) => m < b.end && m + step > b.start);
            if (!clash) slots.push({ start: hm(m), end: hm(m + step) });  
        }
        return slots;
    }
}
