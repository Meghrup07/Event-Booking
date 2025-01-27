import { IsDate, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class EventDTO{
    @IsString()
    @IsNotEmpty()
    eventName:string;

    @IsString()
    @IsNotEmpty()
    eventType: string;
    
    @IsDate()
    date: Date;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(?:AM|PM)$/i, {
        message: 'Start time must be in 12-hour format (hh:mm AM/PM)'
    })
    startTime: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(?:AM|PM)$/i, {
        message: 'End time must be in 12-hour format (hh:mm AM/PM)'
    })
    endTime: string;

    @IsNumber()
    totalSeats: number;

    @IsString()
    bookedSeats: string[];
}