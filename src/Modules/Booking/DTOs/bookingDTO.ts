import { IsNotEmpty, IsString } from "class-validator";

export class BookingDTO{
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    eventId: string

    @IsString()
    @IsNotEmpty()
    seatNumber: string
}