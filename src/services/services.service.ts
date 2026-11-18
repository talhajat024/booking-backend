import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {BusinessesService} from '../businesses/businesses.service';
import {CreateServiceDto} from './dto/create-service.dto';
import { Service } from './service.entity';

@Injectable()
export class ServicesService {
    constructor(@InjectRepository(Service) private services:Repository<Service>,private businessesService:BusinessesService) {}

    async create(businessId:number,ownerId:number,dto:CreateServiceDto){
        await this.businessesService.assertOwner(businessId,ownerId);
        return this.services.save(this.services.create({...dto,businessId}));
    }

    findByBusiness(businessId:number){
        return this.services.find({where:{businessId}});
    }
}
