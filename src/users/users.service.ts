import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private users:Repository<User>) {}

    findAll() {
        return this.users.find();
    }

    findByEmail(email:string){
        return this.users.findOneBy({email}); 
    }

    create(data: Partial<User>){
        return this.users.save(this.users.create(data));
    }

}
