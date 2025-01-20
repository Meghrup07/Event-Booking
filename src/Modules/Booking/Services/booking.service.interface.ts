import { BookingDTO } from "../DTOs/bookingDTO";

export interface IBookingService {

    bookTicket(bookingDTO: BookingDTO);

    getUserBookings(userId: string);

    cancelBooking(id: string);
}