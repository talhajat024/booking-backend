import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column({name: 'password_hash'})
    passwordHash:string;

    @Column()
    role: 'owner' | 'customer';

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;
}