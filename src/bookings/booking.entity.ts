import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookings')
export class Booking{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'customer_id'})
    customerId:number;

    @Column({name:'business_id'})
    businessId:number;

    @Column({name:'service_id'})
    serviceId:number;

    @Column({name:'start_time',type:'timestamp'})
    startTime:string;

    @Column({name:'end_time',type:'timestamp'})
    endTime:string;

    @Column()
    status:string;

    @CreateDateColumn({name:'created_at'})
    createdAt:Date;

}