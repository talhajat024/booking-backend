import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';

  export interface AuthRequest extends Request {
    user: { sub: number; role: string };
  }
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {  
      const request = context.switchToHttp().getRequest<AuthRequest>();
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
  
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }
  
      try {
        request['user'] = await this.jwtService.verifyAsync(token);
        // console.log("Verified User: ", request['user']);
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  }