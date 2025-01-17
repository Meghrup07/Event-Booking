import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDTO } from 'src/Modules/User/DTOs/UpdateUserDTO';
import { UserRepository } from './Repository/user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository){}

    async updateUser(id: string, @Body() updateUserDTO: UpdateUserDTO){
        const user = await this.userRepository.findByEmail(updateUserDTO.email);
        if(user && user.id !== id){
            throw new BadRequestException('Email already exists');
        }
        await this.userRepository.updateUser(id, updateUserDTO);

        return {
            message: 'Event updated successfully',
            status: 200
        }
    }

    async getUser(id:string){
        const user = this.userRepository.findById(id);
        if(!user){
            throw new NotFoundException("User not found");
        }
        return user;
    }

}
