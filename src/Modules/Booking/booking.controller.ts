import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookingService } from './Services/booking.service';
import { JwtAuthGuard } from 'src/Common/Guards/jwt.guard';
import { Types } from 'mongoose';
import { BookingDTO } from 'src/Modules/Booking/DTOs/bookingDTO';

@Controller('booking')
export class BookingController {

    constructor(private readonly bookingService: BookingService) { }

    @Post('book-ticket')
    @UseGuards(JwtAuthGuard)
    async bookTicket(@Body() bookingDTO: BookingDTO) {
        return await this.bookingService.bookTicket(bookingDTO)
    }

    @Get('booking-list/:userId')
    @UseGuards(JwtAuthGuard)
    async bookingList(@Param('userId') userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new NotFoundException('Invalid User ID format');
        }
        return await this.bookingService.getUserBookings(userId);
    }

    @Delete('cancel-booking/:id')
    @UseGuards(JwtAuthGuard)
    async cancelBooking(@Param('id') id: string) {
        return await this.bookingService.cancelBooking(id);
    }

}
