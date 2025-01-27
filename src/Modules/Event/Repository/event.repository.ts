import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventDTO } from "src/Modules/Event/DTOs/eventDTO";
import { QueryParamDTO } from "src/Common/Params/query-paramDTO";
import { getPagination, getSearchQuery } from "src/Common/Helpers/query-params.helper";
import { Event, EventDocument } from "src/Entities/Event/event.schema";
import { IEventRepository } from "./event.interface";


@Injectable()
export class EventRepository implements IEventRepository {
    constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) { }

    async findEventByName(eventName: string) {
        return this.eventModel.findOne({ eventName });
    }

    async findAll(queryParamDTO: QueryParamDTO) {
        const { skip, limit } = getPagination(queryParamDTO.page, queryParamDTO.limit);
        const searchQuery = getSearchQuery(queryParamDTO.search, ['eventName', 'eventType']);
        const query = this.eventModel.find(searchQuery).skip(skip).limit(limit);
        const total = await this.eventModel.countDocuments(searchQuery);
        const result = await query;
        return { data: result, total };
    }

    async findById(id: string) {
        return this.eventModel.findById(id);
    }

    async createEvent(eventDTO: EventDTO) {
        var event = new this.eventModel(eventDTO);
        return event.save();
    }

    async updateEvent(id: string, eventDTO: EventDTO) {
        return this.eventModel.findByIdAndUpdate(id, eventDTO, { new: true });
    }

    async deleteEvent(id: string) {
        return this.eventModel.findByIdAndDelete(id);
    }

}