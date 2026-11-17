import { ConflictException,Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService:JwtService
    ) {}

    async register(dto:RegisterDto){
        const existing = await this.userService.findByEmail(dto.email);
        if(existing) throw new ConflictException('Email already in use');

        const passwordHash = await bcrypt.hash(dto.password,10);
        const user = await this.userService.create({
            name:dto.name,
            email:dto.email,
            passwordHash,
            role:dto.role
        });
        const {passwordHash:_omit,...safeUser}=user;
        return safeUser;
    }

    async login(dto:LoginDto)
    {
        const user = await this.userService.findByEmail(dto.email);
        const valid = user && (await bcrypt.compare(dto.password,user.passwordHash));
        if(!user || !valid) throw new UnauthorizedException('Invalid email or password');

        const payload = {sub:user.id, role:user.role};
        return {access_token:await this.jwtService.signAsync(payload)};
    }
}
