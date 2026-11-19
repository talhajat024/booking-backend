import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('availability')
export class Availability{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'business_id'})
    businessId:number;

    @Column({name:'day_of_week'})
    dayOfWeek:number;

    @Column({name:'start_time',type:'time'})
    startTime:string;

    @Column({name:'end_time',type:'time'})
    endTime:string;

}