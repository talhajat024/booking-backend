import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessesService {
  constructor(@InjectRepository(Business) private businesses: Repository<Business>) {}
  
  create(ownerId:number,dto:CreateBusinessDto){
    const business = this.businesses.create({...dto,ownerId});
    return this.businesses.save(business);
  }
  findMine(ownerId:number){
    return this.businesses.find({where:{ownerId}});
  }
}
