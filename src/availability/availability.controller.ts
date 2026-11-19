import { Body,Controller,Delete,Get,Param,ParseIntPipe,Put,Req,UseGuards } from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';
import type {AuthRequest} from '../auth/auth.guard';
import {Roles} from '../auth/roles.decorator';
import {RolesGuard} from '../auth/roles.guard'; 
import {AvailabilityService} from './availability.service';
import {SetAvailabilityDto} from './dto/set-availability.dto';


@Controller('businesses/:businessId/availability')
export class AvailabilityController {
    constructor(private availabilityService:AvailabilityService){}

    @Put()
    @UseGuards(AuthGuard,RolesGuard)
    @Roles('owner')
    setDay(@Param('businessId',ParseIntPipe) businessId: number, @Req() req: AuthRequest, @Body() dto:SetAvailabilityDto){
        return this.availabilityService.setDay(businessId,req.user.sub,dto);
    }

    @Delete(':dayOfWeek')
    @UseGuards(AuthGuard,RolesGuard)
    @Roles('owner')
    removeDay(@Param('businessId',ParseIntPipe) businessId: number, @Req() req: AuthRequest, @Param('dayOfWeek',ParseIntPipe) dayOfWeek:number){
        return this.availabilityService.removeDay(businessId,req.user.sub,dayOfWeek);
    }

    @Get()
    findAll(@Param('businessId',ParseIntPipe) businessId: number){
        return this.availabilityService.findByBusiness(businessId);
    }
}
