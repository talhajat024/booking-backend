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

    // try this by not writing partial
    create(data: Partial<User>){
        return this.users.save(this.users.create(data));
    }

    findByVerificationHash(hash:string){
        return this.users.findOne({where:{verificationTokenHash:hash}});
    }

    save(user:User){
        return this.users.save(user);
    }

    findByResetTokenHash(hash: string) {
    return this.users.findOne({ where: { resetTokenHash: hash } });
    }

}
