import { Controller,Body,Post,Req,UseGuards } from '@nestjs/common';
import {AuthGuard} from "../auth/auth.guard";
import { RolesGuard } from '../auth/roles.guard';
import {Roles} from '../auth/roles.decorator';
import type {AuthRequest} from "../auth/auth.guard";
import {BookingsService} from "./bookings.service";
import {CreateBookingDto} from "./dto/create-booking.dto";

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService:BookingsService) {}

    @Post()
    @UseGuards(AuthGuard,RolesGuard)
    @Roles('customer')
    create(@Req() req:AuthRequest,@Body() dto:CreateBookingDto){
        return this.bookingsService.create(req.user.sub,dto);
    }

    
}
