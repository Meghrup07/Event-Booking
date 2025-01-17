import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EventDTO{
    @IsString()
    @IsNotEmpty()
    eventName:string;

    @IsString()
    @IsNotEmpty()
    eventType: string;
    
    @IsDate()
    date: Date;

    @IsNumber()
    totalSeats: number;

    @IsString()
    bookedSeats: string[];
}