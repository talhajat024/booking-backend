import { BadRequestException, Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { BusinessesService } from '../businesses/businesses.service';
import {Availability} from './availability.entity';
import {SetAvailabilityDto} from './dto/set-availability.dto';

@Injectable()
export class AvailabilityService {
    constructor(@InjectRepository(Availability) private availability:Repository<Availability>,private businessesService:BusinessesService) {}

    async setDay(businessId:number,ownerId:number,dto:SetAvailabilityDto){
        await this.businessesService.assertOwner(businessId,ownerId);
        if(dto.startTime >= dto.endTime) {
            throw new BadRequestException('startTime must be before endTime');
        }
        await this.availability.upsert(
            {businessId,dayOfWeek:dto.dayOfWeek,startTime:dto.startTime,endTime:dto.endTime},['businessId','dayOfWeek']
        )
        return this.findByBusiness(businessId);
    }

    async removeDay(businessId:number,ownerId:number,dayOfWeek:number){
        await this.businessesService.assertOwner(businessId,ownerId);
        await this.availability.delete({businessId,dayOfWeek});
        return this.findByBusiness(businessId);
    }

    findByBusiness(businessId:number){
        return this.availability.find({where:{businessId}});
    }

    findByDay(businessId: number, dayOfWeek: number) {
    return this.availability.findOne({ where: { businessId, dayOfWeek } });
    }

}
