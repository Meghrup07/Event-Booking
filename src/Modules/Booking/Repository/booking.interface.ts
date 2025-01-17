import { BookingDTO } from "src/Modules/Booking/DTOs/bookingDTO";


export interface IBookingRepository{
    createBooking(bookingDTO: BookingDTO);

    findByUserId(userId: string);

    cancelBooking(id: string);
}