import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Service } from './service.entity';
import { BusinessesModule } from '../businesses/businesses.module';

@Module({
   imports: [TypeOrmModule.forFeature([Service]), BusinessesModule],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService]
})
export class ServicesModule {}
