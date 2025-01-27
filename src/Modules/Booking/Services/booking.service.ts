import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
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


    private convert12To24(time12h: string): string {
        const [time, modifier] = time12h.split(/\s+/);
        let [hours, minutes] = time.split(':');
        let hoursNum = parseInt(hours, 10);
        if (hoursNum === 12) {
            hoursNum = modifier.toUpperCase() === 'PM' ? 12 : 0;
        } else if (modifier.toUpperCase() === 'PM') {
            hoursNum = hoursNum + 12;
        }
        return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
    }


    async bookTicket(@Body() bookingDTO: BookingDTO) {

        if (!Types.ObjectId.isValid(bookingDTO.eventId)) {
            throw new NotFoundException({
                message: 'Invalid Event ID format',
                status: false
            });
        }

        const event = await this.eventModel.findById(bookingDTO.eventId);
        if (!event) {
            throw new NotFoundException({
                message: 'Event not found',
                status: false
            });
        }

        if (!event.bookedSeats) {
            event.bookedSeats = [];
        }

        const currentDate = new Date();
        const eventEndDate = new Date(event.date);

        if (currentDate > eventEndDate) {
            throw new NotFoundException({
                message: 'Event has already passed',
                status: false
            });
        }

        if (eventEndDate.getTime() === currentDate.getTime()) {
            const endTime24 = this.convert12To24(event.endTime);
            const [eventEndHours, eventEndMinutes] = endTime24.split(':').map(Number);
            const currentHours = currentDate.getHours();
            const currentMinutes = currentDate.getMinutes();

            if (currentHours > eventEndHours ||
                (currentHours === eventEndHours && currentMinutes > eventEndMinutes)) {
                throw new BadRequestException({
                    message: 'Event has ended',
                    status: false
                });
            }
        }

        const alreadyBookedSeats = bookingDTO.seatNumber.filter(seat => event.bookedSeats.includes(seat));

        if (alreadyBookedSeats.length > 0) {
            throw new BadRequestException({
                message: `Seats ${alreadyBookedSeats.join(', ')} are already booked`,
                status: false
            });
        }

        event.bookedSeats.push(...bookingDTO.seatNumber);

        await event.save();

        await this.bookingRepository.createBooking(bookingDTO);

        return {
            message: 'Ticket booked successfully',
            status: true
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
            throw new NotFoundException({
                message: 'Invalid Booking ID format',
                status: false
            });
        }

        const booking = await this.bookingRepository.cancelBooking(id);
        if (!booking) {
            throw new NotFoundException({
                message: 'Booking not found',
                status: false
            });
        }

        const event = await this.eventModel.findById(booking.eventId);
        if (!event) {
            throw new NotFoundException({
                message: 'Event not found',
                status: false
            });
        }

        event.bookedSeats = event.bookedSeats.filter(seat => !booking.seatNumber.includes(seat));
        await event.save();

        await this.bookingRepository.cancelBooking(id);
        return {
            message: 'Booking cancelled successfully',
            status: true
        }

    }



}
