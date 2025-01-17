import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";


@Schema()
export class Booking{

    @Prop({
        required: true
    })
    userId:string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true
    })
    eventId:string;

    @Prop({
        required: true
    })
    seatNumber:string;

}

export type BookingDocument = Booking & Document;

export const BookingSchema = SchemaFactory.createForClass(Booking);