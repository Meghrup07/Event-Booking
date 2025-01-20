import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventDTO } from 'src/Modules/Event/DTOs/eventDTO';
import { QueryParamDTO } from 'src/Common/Params/query-paramDTO';
import { EventRepository } from '../Repository/event.repository';
import { IEventService } from './event.service.interface';

@Injectable()
export class EventService implements IEventService {
    constructor(private eventRepository: EventRepository) { }

    async createEvent(@Body() eventDTO: EventDTO) {
        const eventNameExist = await this.eventRepository.findEventByName(eventDTO.eventName);
        if (eventNameExist) {
            throw new BadRequestException('Event name already exists');
        }
        await this.eventRepository.createEvent(eventDTO);
        return {
            message: 'Event created successfully',
            status: 200
        }
    }

    async getAllEvent(queryParamDTO: QueryParamDTO) {
        return this.eventRepository.findAll(queryParamDTO);
    }

    async getEventById(id: string) {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        return event;
    }

    async updateEvent(id: string, @Body() eventDTO: EventDTO) {
        const eventNameExist = await this.eventRepository.findEventByName(eventDTO.eventName);
        if (eventNameExist && eventNameExist._id.toString() !== id) {
            throw new BadRequestException('Event name already exists');
        }
        const event = await this.eventRepository.updateEvent(id, eventDTO);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        return {
            message: 'Event updated successfully',
            status: 200
        }
    }

    async deleteEvent(id: string) {
        const event = await this.eventRepository.deleteEvent(id);
        if (!event) {
            throw new NotFoundException('Event not found');
        }
        return {
            message: 'Event deleted successfully',
            status: 200
        }
    }

}
