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

    @Column({ type: 'varchar', name: 'start_time' })
    startTime: string;
    
    @Column({ type: 'varchar', name: 'end_time' })
    endTime: string;

    @Column()
    status:string;

    @CreateDateColumn({name:'created_at'})
    createdAt:Date;

}