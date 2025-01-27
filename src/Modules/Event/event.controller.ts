import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EventService } from './Services/event.service';
import { JwtAuthGuard } from 'src/Common/Guards/jwt.guard';
import { RolesGuard } from 'src/Common/Guards/roles.guard';
import { Roles } from 'src/Common/Decorators/roles.decorator';
import { Types } from 'mongoose';
import { EventDTO } from 'src/Modules/Event/DTOs/eventDTO';
import { QueryParamDTO } from 'src/Common/Params/query-paramDTO';

@Controller('event')
export class EventController {

    constructor(private readonly eventService: EventService) { }

    @Post('create-event')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async createEvent(@Body() eventDTO: EventDTO) {
        try {
            return await this.eventService.createEvent(eventDTO);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Get('event-list')
    @UseGuards(JwtAuthGuard)
    async getAllEvents(@Query() queryParamDTO: QueryParamDTO) {
        try {
            return await this.eventService.getAllEvent(queryParamDTO);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getEvent(@Param('id') id: string) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.eventService.getEventById(id);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Put('update-event/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async updateEvent(@Param('id') id: string, @Body() eventDTO: EventDTO) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.eventService.updateEvent(id, eventDTO);
        }
        catch (error) {
            throw new NotFoundException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Delete('delete-event/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async deleteEvent(@Param('id') id: string) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.eventService.deleteEvent(id);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

}
