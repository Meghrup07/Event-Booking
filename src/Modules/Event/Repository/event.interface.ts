import { EventDTO } from "src/Modules/Event/DTOs/eventDTO";
import { QueryParamDTO } from "src/Common/Params/query-paramDTO";


export interface IEventRepository{
    findEventByName(eventName: string);

    findAll(queryParamDTO: QueryParamDTO);

    findById(id:string);

    createEvent(eventDTO: EventDTO);

    updateEvent(id:string, eventDTO: EventDTO);

    deleteEvent(id:string);
}