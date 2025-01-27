import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './Services/user.service';
import { JwtAuthGuard } from 'src/Common/Guards/jwt.guard';
import { UpdateUserDTO } from 'src/Modules/User/DTOs/UpdateUserDTO';
import { Types } from 'mongoose';
import { RolesGuard } from 'src/Common/Guards/roles.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Put('update-user/:id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.userService.updateUser(id, updateUserDTO);
        }
        catch (error) {
            throw new NotFoundException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUser(@Param('id') id: string) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.userService.getUser(id);
        }
        catch (error) {
            throw new NotFoundException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    async getAllUser() {
        try {
            return await this.userService.getAllUser();
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Delete('delete-user/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    async deleteUser(@Param('id') id: string) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.userService.deleteUser(id);
        }
        catch (error) {
            throw new NotFoundException({
                message: error.response.message,
                status: false
            });
        }
    }

}
