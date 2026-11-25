import { ConflictException,Injectable,UnauthorizedException,BadRequestException, ForbiddenException } from '@nestjs/common';
import { hashToken } from './verification-token.util';
import { generateVerificationToken } from './verification-token.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import { repl } from '@nestjs/core';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService:JwtService,
        private mailService: MailService
    ) {}

    async register(dto:RegisterDto){
        const existing = await this.userService.findByEmail(dto.email);
        if(existing) throw new ConflictException('Email already in use');

        const passwordHash = await bcrypt.hash(dto.password,10);
        const {token, hash,expiresAt }= generateVerificationToken();

        await this.userService.create({
            name:dto.name,
            email:dto.email,
            passwordHash,
            role:dto.role,
            verificationTokenHash:hash,
            verificationExpiresAt:expiresAt
        });
        // console.log(`Verify link: http://localhost:5173/verify-email?token=${token}`);
        try {
          await this.mailService.sendVerificationEmail(dto.email, token);
        } catch (err) {
          console.error('Failed to send verification email', err);
        }
        return {message: 'Check your email to verify your account'};
    }

    async login(dto:LoginDto)
    {
        const user = await this.userService.findByEmail(dto.email);
        const valid = user && (await bcrypt.compare(dto.password,user.passwordHash));
        if(!user || !valid) throw new UnauthorizedException('Invalid email or password');

        if(!user.emailVerified){
            throw new ForbiddenException({
                statusCode:403,
                error:'Forbidden',
                message:'Please verify your email before logging in',
                code:'EMAIL_NOT_VERIFIED'
            })
        }

        const payload = {sub:user.id, role:user.role};
        const expiresIn = dto.rememberMe ? '7d' : '1d';
        return {access_token:await this.jwtService.signAsync(payload,{expiresIn})};
    }

    async verifyEmail(token:string){
        const user = await this.userService.findByVerificationHash(hashToken(token));
        if(!user || !user.verificationExpiresAt || user.verificationExpiresAt < new Date()){
            throw new BadRequestException('Invalid or expired verification link');
        }

        user.emailVerified = true;
        user.verificationTokenHash = null;
        user.verificationExpiresAt = null;
        await this.userService.save(user);

        return {message:'Email verified. You can now log in.'};
    }

    async resendVerification(email:string){
         const reply = { message: 'If that account exists and is not verified, a new link has been sent',};
         const user = await this.userService.findByEmail(email);
         if(!user || user.emailVerified) return reply;

         // send recently condition
         const DAY = 24*60*60*1000;
         const sentRecently = user.verificationExpiresAt && user.verificationExpiresAt.getTime() > Date.now() + DAY - 60 * 1000;

         if(sentRecently) return reply;

         const {token,hash,expiresAt} = generateVerificationToken();

         user.verificationTokenHash = hash;
         user.verificationExpiresAt = expiresAt;
         await this.mailService.sendVerificationEmail(user.email,token);

         return reply;
    }

    async sendPasswordResetEmail(to:string,token:string){
        try {
          await this.mailService.sendVerificationEmail(to, token);
        } catch (err) {
          console.error('Failed to send verification email', err);
        }
        return {message: 'Check your email to verify your account'};
    }

    async forgotPassword(email:string){

        const reply = {
            message: 'If an account with that email exists, a reset link has been sent',
             };

        const user = await this.userService.findByEmail(email);
        if(!user) return reply;

        // cooldown: expiry still ~1h away means a link was sent under a minute ago
        const HOUR = 60 * 60 * 1000;
        const sentRecently =
          user.resetExpiresAt &&
          user.resetExpiresAt.getTime() > Date.now() + HOUR - 60 * 1000;
        if (sentRecently) return reply;

        const {token,hash,expiresAt} = generateVerificationToken(HOUR);
        user.resetTokenHash = hash;
        user.resetExpiresAt = expiresAt;
        await this.userService.save(user);

        await this.mailService.sendPasswordResetEmail(user.email,token);
        return reply;
    }

    async resetPassword(dto:ResetPasswordDto)
    {
        const hash = createHash('sha256').update(dto.token).digest('hex');
        const user = await this.userService.findByResetTokenHash(hash);

        if(!user || !user.resetExpiresAt || user.resetExpiresAt.getTime() < Date.now()){
            throw new BadRequestException('Invalid or expired reset link');
        }

        user.passwordHash = await bcrypt.hash(dto.newPassword,10);
        user.resetTokenHash = null;
        user.resetExpiresAt = null;
        user.emailVerified = true;
        await this.userService.save(user);

        return { message: 'Password updated. You can now log in.'};
    }
}
