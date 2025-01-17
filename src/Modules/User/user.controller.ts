import { Body, Controller, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/Common/Guards/jwt.guard';
import { UpdateUserDTO } from 'src/Modules/User/DTOs/UpdateUserDTO';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Put('update-user/:id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO){
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid Event ID format');
        }
        return await this.userService.updateUser(id, updateUserDTO);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUser(@Param('id') id: string){
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid Event ID format');
        }
        return await this.userService.getUser(id);
    }

}
