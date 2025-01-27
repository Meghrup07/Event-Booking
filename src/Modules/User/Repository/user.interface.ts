import { UpdateUserDTO } from "src/Modules/User/DTOs/UpdateUserDTO";

export interface IUserRepository{
    updateUser(id:string, updateUserDTO: UpdateUserDTO);

    findById(id:string);

    findByEmail(email: string);

    findAll();

    deleteUser(id:string);
}