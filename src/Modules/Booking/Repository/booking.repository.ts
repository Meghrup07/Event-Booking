import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookingDTO } from "src/Modules/Booking/DTOs/bookingDTO";
import { Booking, BookingDocument } from "src/Entities/Booking/booking.schema";
import { IBookingRepository } from "./booking.interface";

@Injectable()
export class BookingRepository implements IBookingRepository{
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
    ){}

    cancelBooking(id: string) {
        return this.bookingModel.findByIdAndDelete(id);
    }

    createBooking(bookingDTO: BookingDTO) {
        const booking = new this.bookingModel(bookingDTO);
        return booking.save();
    }

    findByUserId(userId: string) {
        return this.bookingModel.find({userId}).populate('eventId').exec();
    }

}