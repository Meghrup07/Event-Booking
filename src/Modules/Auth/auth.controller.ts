import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/Modules/Auth/DTOs/registerDTO';
import { LoginDTO } from 'src/Modules/Auth/DTOs/loginDTO';
import { Types } from 'mongoose';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDTO: RegisterDTO) {
        try {
            return await this.authService.register(registerDTO);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
        try {
            return await this.authService.login(loginDTO);
        }
        catch (error) {
            throw new BadRequestException({
                message: error.response.message,
                status: false
            });
        }
    }

    @Get('user/:id')
    async getUser(@Param('id') id: string) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new NotFoundException({
                    message: 'Invalid Event ID format',
                    status: false
                });
            }
            return await this.authService.getUser(id);
        }
        catch (error) {
            throw new NotFoundException({
                message: error.response.message,
                status: false
            });
        }
    }

}
