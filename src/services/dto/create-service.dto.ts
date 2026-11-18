import {IsInt,IsNotEmpty,IsNumber,Min} from 'class-validator';

export class CreateServiceDto{
    @IsNotEmpty()
    name:string;

    @IsInt()
    @Min(5)
    durationMinutes:number;

    @IsNumber({maxDecimalPlaces:2})
    @Min(0)
    price:number;

}