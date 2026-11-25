import { Controller,Body,Post,HttpCode,HttpStatus,Req,UseGuards,Get } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

    @Post('verify-email')
    @HttpCode(200)
    verifyEmail(@Body() dto: VerifyEmailDto)
    {
        return this.authService.verifyEmail(dto.token);
    }

    @Post('resend-verification')
    @HttpCode(200)
    resendVerification(@Body() dto: ResendVerificationDto) {
      return this.authService.resendVerification(dto.email);
    }

    @Post('forgot-password')
    @HttpCode(200)
    forgotPassword(@Body() dto:ForgotPasswordDto){
        return this.authService.forgotPassword(dto.email);
    }

    @Post('reset-password')
    @HttpCode(200)
    resetPassword(@Body() dto: ResetPasswordDto) {
      return this.authService.resetPassword(dto);
    }
}
