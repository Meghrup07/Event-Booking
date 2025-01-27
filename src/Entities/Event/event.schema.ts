import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Event{
    @Prop({
        required: true
    })
    eventName: string;

    @Prop({
        required:true
    })
    eventType: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    startTime: string;

    @Prop({ required: true })
    endTime: string;

    @Prop({ required: true })
    totalSeats: number;

    @Prop({ type: [String], default: [] })
    bookedSeats: string[];
}

export type EventDocument = Event & Document

export const EventSchema = SchemaFactory.createForClass(Event);