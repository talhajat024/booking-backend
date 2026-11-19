import {IsInt,Matches,Max,Min} from 'class-validator';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export class SetAvailabilityDto {
    @IsInt()
    @Min(0)
    @Max(6)
    dayOfWeek: number;

    @Matches(TIME,{message:'startTime must be HH:MM'})
    startTime: string;

    @Matches(TIME, {message: 'endTime must be HH:MM' })
    endTime: string;
}