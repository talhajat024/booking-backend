import { Column,CreateDateColumn, Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity('businesses')
export class Business{
    
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=> User)
    @JoinColumn({name:'owner_id'})
    owner:User;

    @Column({name:'owner_id'})
    ownerId:number;

    @Column()
    name:string;

    @Column({nullable:true})
    description:string;

    @CreateDateColumn({name:'created_at'})
    createdAt:Date;

}