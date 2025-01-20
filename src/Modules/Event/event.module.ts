import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/Entities/Event/event.schema';
import { ConfigModule } from '@nestjs/config';
import { EventRepository } from './Repository/event.repository';
import { EventService } from './Services/event.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])
  ],
  providers: [EventService, EventRepository],
  controllers: [EventController]
})
export class EventModule { }
