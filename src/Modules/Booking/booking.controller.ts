import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
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
        try {
            return await this.bookingService.bookTicket(bookingDTO)
        }
        catch (error: any) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Get('booking-list/:userId')
    @UseGuards(JwtAuthGuard)
    async bookingList(@Param('userId') userId: string) {
        try {
            if (!Types.ObjectId.isValid(userId)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.bookingService.getUserBookings(userId);
        }
        catch (error) {
            throw new NotFoundException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Delete('cancel-booking/:id')
    @UseGuards(JwtAuthGuard)
    async cancelBooking(@Param('id') id: string) {
        try {
            return await this.bookingService.cancelBooking(id);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

}
