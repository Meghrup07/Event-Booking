import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventDTO } from 'src/Modules/Event/DTOs/eventDTO';
import { QueryParamDTO } from 'src/Common/Params/query-paramDTO';
import { EventRepository } from '../Repository/event.repository';

@Injectable()
export class EventService {
  constructor(private eventRepository: EventRepository) { }

  async createEvent(@Body() eventDTO: EventDTO) {

    const eventNameExist = await this.eventRepository.findEventByName(eventDTO.eventName);
    if (eventNameExist) {
      throw new NotFoundException({
        message: 'Event name already exists',
        status: false,
      });
    }
    await this.eventRepository.createEvent(eventDTO);
    return {
      message: 'Event created successfully',
      status: true,
    };

  }

  async getAllEvent(queryParamDTO: QueryParamDTO) {

    return await this.eventRepository.findAll(queryParamDTO);

  }

  async getEventById(id: string) {

    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException({
        message: 'Event not found',
        status: false,
      });
    }
    return event;

  }

  async updateEvent(id: string, @Body() eventDTO: EventDTO) {

    const eventNameExist = await this.eventRepository.findEventByName(eventDTO.eventName);
    if (eventNameExist && eventNameExist._id.toString() !== id) {
      throw new NotFoundException({
        message: 'Event name already exists',
        status: false,
      });
    }
    const event = await this.eventRepository.updateEvent(id, eventDTO);
    if (!event) {
      throw new NotFoundException({
        message: 'Event not found',
        status: false,
      });
    }
    return {
      message: 'Event updated successfully',
      status: true,
    };

  }

  async deleteEvent(id: string) {

    const event = await this.eventRepository.deleteEvent(id);
    if (!event) {
      throw new NotFoundException({
        message: 'Event not found',
        status: false,
      });
    }
    return {
      message: 'Event deleted successfully',
      status: true,
    };

  }
}
