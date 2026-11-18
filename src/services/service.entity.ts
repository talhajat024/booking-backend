import {Column,CreateDateColumn,Entity,PrimaryGeneratedColumn} from 'typeorm';

@Entity('services')
export class Service {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:'business_id'})
    businessId:number;

    @Column()
    name:string;

    @Column({name:'duration_minutes'})
    durationMinutes:number;

    @Column({
        type:'numeric',
        precision:10,
        scale:2,
        transformer:{ to:(v:number)=> v,from:(v:string)=> parseFloat(v) },
    })
    price:number;

    @CreateDateColumn({name:'created_at'})
    createdAt:Date;
}