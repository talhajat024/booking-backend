import { Body,Controller,Get,Post,Req,UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import type { AuthRequest } from '../auth/auth.guard';

@Controller('businesses')
@UseGuards(AuthGuard,RolesGuard)
export class BusinessesController {
    constructor(private businessesService:BusinessesService){}

    @Post()
    @Roles('owner')
    create(@Req() req: AuthRequest, @Body() dto: CreateBusinessDto) {
        return this.businessesService.create(req.user.sub, dto);
    }

    @Get('mine')
    @Roles('owner')
    findMine(@Req() req: AuthRequest) {
        return this.businessesService.findMine(req.user.sub);
    }
}
