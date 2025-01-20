import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BookingDTO } from 'src/Modules/Booking/DTOs/bookingDTO';
import { Event, EventDocument } from 'src/Entities/Event/event.schema';
import { BookingRepository } from '../Repository/booking.repository';
import { IBookingService } from './booking.service.interface';

@Injectable()
export class BookingService implements IBookingService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        private bookingRepository: BookingRepository
    ) { }


    async bookTicket(@Body() bookingDTO: BookingDTO) {

        if (!Types.ObjectId.isValid(bookingDTO.eventId)) {
            throw new BadRequestException('Invalid Event ID format');
        }

        const event = await this.eventModel.findById(bookingDTO.eventId);
        if (!event) throw new BadRequestException('Event not found');

        if (!event.bookedSeats) {
            event.bookedSeats = [];
        }

        if (event.date < new Date()) {
            throw new BadRequestException('Event is expired');
        }

        if (event.bookedSeats.includes(bookingDTO.seatNumber)) {
            throw new BadRequestException('Seat is already booked');
        }

        event.bookedSeats.push(bookingDTO.seatNumber);

        await event.save();

        await this.bookingRepository.createBooking(bookingDTO);

        return {
            message: 'Ticket booked successfully',
            status: 200
        }

    }

    async getUserBookings(userId: string) {
        const bookings = await this.bookingRepository.findByUserId(userId);
        return {
            data: bookings.map(booking => {
                const event = booking.eventId as any;
                return {
                    _id: booking._id,
                    userId: booking.userId,
                    eventId: event._id,
                    eventName: event.eventName,
                    eventType: event.eventType,
                    date: event.date,
                    seatNumber: booking.seatNumber,
                    __v: booking.__v,
                };
            }),
        }
    }


    async cancelBooking(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid Booking ID format');
        }

        const booking = await this.bookingRepository.cancelBooking(id);
        if (!booking) throw new BadRequestException('Booking not found');

        const event = await this.eventModel.findById(booking.eventId);
        if (!event) {
            throw new BadRequestException('Event not found');
        }

        event.bookedSeats = event.bookedSeats.filter(seat => seat !== booking.seatNumber);
        await event.save();

        await this.bookingRepository.cancelBooking(id);
        return {
            message: 'Booking cancelled successfully',
            status: 200
        }
    }



}
