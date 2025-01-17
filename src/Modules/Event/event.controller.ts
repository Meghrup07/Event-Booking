import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/Common/Guards/jwt.guard';
import { RolesGuard } from 'src/Common/Guards/roles.guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';
import { Types } from 'mongoose';
import { EventDTO } from 'src/Modules/Event/DTOs/eventDTO';
import { QueryParamDTO } from 'src/Common/Params/query-paramDTO';

@Controller('event')
export class EventController {

    constructor(private readonly eventService: EventService){}

    @Post('create-event')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async createEvent(@Body() eventDTO: EventDTO){
        return await this.eventService.createEvent(eventDTO);
    }

    @Get('event-list')
    @UseGuards(JwtAuthGuard)
    async getAllEvents(@Query() queryParamDTO: QueryParamDTO){
        return await this.eventService.getAllEvent(queryParamDTO);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getEvent(@Param('id') id:string){
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid Event ID format');
        }
        return await this.eventService.getEventById(id);
    }

    @Put('update-event/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async updateEvent(@Param('id') id:string, @Body() eventDTO: EventDTO){
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid Event ID format');
        }
        return await this.eventService.updateEvent(id, eventDTO);
    }

    @Delete('delete-event/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async deleteEvent(@Param('id') id: string){
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid Event ID format');
        }
        return await this.eventService.deleteEvent(id);
    }

}
