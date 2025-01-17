import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/Entities/Booking/booking.schema';
import { Event, EventSchema } from 'src/Entities/Event/event.schema';
import { BookingRepository } from './Repository/booking.repository';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Booking.name, schema: BookingSchema },
            { name: Event.name, schema: EventSchema }
        ])
    ],
    providers: [BookingService, BookingRepository],
    controllers: [BookingController]
})
export class BookingModule {}
