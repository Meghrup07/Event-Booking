import { QueryParamDTO } from "src/Common/Params/query-paramDTO";
import { EventDTO } from "../DTOs/eventDTO";

export interface IEventService {

    createEvent(eventDTO: EventDTO);

    getAllEvent(queryParamDTO: QueryParamDTO);

    getEventById(id: string);

    updateEvent(id: string, eventDTO: EventDTO);

    deleteEvent(id: string);

}