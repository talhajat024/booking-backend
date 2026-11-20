import { Controller,Body,Post,HttpCode,HttpStatus,Req,UseGuards,Get } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('register')
    register(@Body() dto:RegisterDto){
        return this.authService.register(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req: { user: Record<string, unknown> }) {
      return req.user;
    }
}
