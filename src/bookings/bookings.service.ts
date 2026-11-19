import { BadRequestException,ConflictException ,Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm/repository/Repository";
import { Booking } from './booking.entity';
import {CreateBookingDto} from "./dto/create-booking.dto";
import {ServicesService} from "../services/services.service";
import {AvailabilityService} from "../availability/availability.service";
import { parseLocal,formatLocal } from './booking-time.util';

@Injectable()
export class BookingsService {

    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,
        private servicesService: ServicesService,
        private availabilityService: AvailabilityService
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
        console.log("sameDay:", sameDay, "start:", formatLocal(start), "end:", formatLocal(end));
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
    
}
