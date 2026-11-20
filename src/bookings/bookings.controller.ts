import { Controller,Body,Post,Req,UseGuards,Get,Param,ParseIntPipe,Patch,Query } from '@nestjs/common';
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

    @Get('mine')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('customer')
    mine(@Req() req: AuthRequest) {
      return this.bookingsService.findForCustomer(req.user.sub);
    }

    @Get('business/:businessId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('owner') 
    forBusiness(
      @Req() req: AuthRequest,
      @Param('businessId', ParseIntPipe) businessId: number,
    ) {
      return this.bookingsService.findForBusiness(businessId, req.user.sub);
    }

    @Patch(':id/cancel')
    @UseGuards(AuthGuard)
    cancel(
      @Req() req: AuthRequest,
      @Param('id', ParseIntPipe) id: number,
    ) {
      return this.bookingsService.cancel(id, req.user);
    }

    @Get('slots')
    slots(@Query('serviceId', ParseIntPipe) serviceId: number,@Query('date') date: string) {
      return this.bookingsService.getFreeSlots(serviceId, date);
    }
}
