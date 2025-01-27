import { BadRequestException, Body, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/Modules/Auth/DTOs/registerDTO';
import { LoginDTO } from 'src/Modules/Auth/DTOs/loginDTO';
import { AuthRepository } from './Repository/auth.repository';
import { use } from 'passport';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository
    ) { }

    async register(@Body() registerDTO: RegisterDTO) {
        var emailExist = await this.authRepository.findByEmail(registerDTO.email)
        if (emailExist) {
            throw new BadRequestException({
                message: 'Email already exists',
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(registerDTO.password, 10);

        await this.authRepository.createAuth(registerDTO, hashedPassword);

        return {
            message: 'User registered successfully',
            status: true
        };
    }

    async login(@Body() loginDTO: LoginDTO) {
        const user = await this.authRepository.findByEmail(loginDTO.email);
        if (!user) {
            throw new BadRequestException({
                message: 'Invalid email',
                status: false
            });
        }

        const isPasswordValid = await bcrypt.compare(loginDTO.password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException({
                message: 'Invalid password',
                status: false
            });
        }

        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        user.token = accessToken;
        user.isTokenExpire = false;
        await user.save();

        const expiresIn = 2 * 60 * 60 * 1000;
        setTimeout(async () => {
            const user = await this.authRepository.findByEmail(loginDTO.email);
            if (user && user.token === accessToken) {
                user.isTokenExpire = true;
                await user.save();
            }
        }, expiresIn);


        return {
            data: {
                _id: user._id,
                email: user.email,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isTokenExpire: user.isTokenExpire,
                token: accessToken,
            },
            message: 'Login successful',
            status: true
        };
    }


    async getUser(id: string) {
        const user = await this.authRepository.getUser(id);

        if (!user) {
            throw new NotFoundException({
                message: 'User not found',
                status: false,
            });
        }

        const userDetails = {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isTokenExpire: user.isTokenExpire,
            token: user.token,
            __v: user.__v,
        };

        return userDetails;
    }

}
