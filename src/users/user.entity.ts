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

    @Column({name:'email_verified', default:false})
    emailVerified:boolean;

    @Column({type:'varchar',name:'verification_token_hash',nullable:true})
    verificationTokenHash : string | null;

    @Column({type:'timestamptz',name:'verification_expires_at',nullable:true})
    verificationExpiresAt: Date | null;

    @Column({ type: 'varchar', name: 'reset_token_hash', nullable: true })
    resetTokenHash: string | null;
    
    @Column({ type: 'timestamptz', name: 'reset_expires_at', nullable: true })
    resetExpiresAt: Date | null;

}