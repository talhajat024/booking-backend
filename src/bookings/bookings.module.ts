import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { ServicesModule } from '../services/services.module';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
   imports: [
    TypeOrmModule.forFeature([Booking]),
    ServicesModule,
    AvailabilityModule,
  ],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
