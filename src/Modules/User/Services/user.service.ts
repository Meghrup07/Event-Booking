import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../Repository/user.repository';
import { UpdateUserDTO } from 'src/Modules/User/DTOs/UpdateUserDTO';
import { IUserService } from './user.service.interface';

@Injectable()
export class UserService implements IUserService {
    constructor(private userRepository: UserRepository) { }

    async updateUser(id: string, @Body() updateUserDTO: UpdateUserDTO) {

        const user = await this.userRepository.findByEmail(updateUserDTO.email);
        if (user && user.id !== id) {
            throw new BadRequestException({
                message: 'Email already exists',
                status: false
            });
        }
        await this.userRepository.updateUser(id, updateUserDTO);

        return {
            message: 'User updated successfully',
            status: true
        }

    }

    async getUser(id: string) {

        const user = this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException({
                message: 'User not found',
                status: false
            });
        }
        return user;

    }

    async getAllUser() {

        const users = await this.userRepository.findAll();
        return {
            data: users,
            message: 'Users get successfully',
            status: true
        }

    }

    async deleteUser(id: string) {

        const user = await this.userRepository.deleteUser(id);
        if (!user) {
            throw new NotFoundException({
                message: 'User not found',
                status: false
            });
        }
        return {
            message: 'User deleted successfully',
            status: true
        }

    }

}
