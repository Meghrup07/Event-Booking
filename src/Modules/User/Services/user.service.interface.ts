import { UpdateUserDTO } from "../DTOs/UpdateUserDTO";

export interface IUserService {

    updateUser(id: string, updateUserDTO: UpdateUserDTO);

    getUser(id: string);

    getAllUser();

    deleteUser(id: string);

}