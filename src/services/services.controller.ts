import { Controller,Body,Get,Param,ParseIntPipe,Post,Req,UseGuards } from '@nestjs/common';
import {AuthGuard} from '../auth/auth.guard';
import type {AuthRequest} from '../auth/auth.guard';
import {Roles} from '../auth/roles.decorator';
import {RolesGuard} from '../auth/roles.guard';
import {CreateServiceDto} from './dto/create-service.dto';
import {ServicesService} from './services.service';

@Controller('businesses/:businessId/services')
export class ServicesController {
    constructor(private servicesService:ServicesService){}

    @Post()
    @UseGuards(AuthGuard,RolesGuard)
    @Roles('owner')
    create(@Param('businessId',ParseIntPipe) businessId: number, @Req() req: AuthRequest, @Body() dto:CreateServiceDto){
        return this.servicesService.create(businessId,req.user.sub,dto);
    }

    @Get()
    findAll(@Param('businessId',ParseIntPipe) businessId: number){
        return this.servicesService.findByBusiness(businessId);
    }

}
