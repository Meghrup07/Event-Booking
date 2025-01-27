import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class BookingDTO{
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    eventId: string

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    seatNumber: string[]

    @IsString()
    @IsNotEmpty()
    bookingDate: string
}

