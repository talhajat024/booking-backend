import {IsInt, Matches,Min} from 'class-validator';
export class CreateBookingDto {
    @IsInt()
    @Min(1)
    serviceId:number;

    @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/, {
    message: 'startTime must be in the format "YYYY-MM-DD HH:MM"',
  })
  startTime: string;
}