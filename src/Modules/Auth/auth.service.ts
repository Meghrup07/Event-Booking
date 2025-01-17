import { BadRequestException, Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from 'src/Modules/Auth/DTOs/registerDTO';
import { LoginDTO } from 'src/Modules/Auth/DTOs/loginDTO';
import { AuthRepository } from './Repository/auth.repository';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository
    ) { }

    async register(@Body() registerDTO: RegisterDTO) {

        var emailExist = await this.authRepository.findByEmail(registerDTO.email)
        if (emailExist) {
            throw new BadRequestException("Email already exits");
        }

        const hashedPassword = await bcrypt.hash(registerDTO.password, 10);

        await this.authRepository.createAuth(registerDTO, hashedPassword);

        return {
            message: 'User registered successfully',
            status: 200
        };
    }

    async login(@Body() loginDTO: LoginDTO) {
        const user = await this.authRepository.findByEmail(loginDTO.email);
        if (!user) throw new UnauthorizedException('Invalid email');

        const isPasswordValid = await bcrypt.compare(loginDTO.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

        const payload = { email: user.email, sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return {
            data: {
                id: user._id,
                email: user.email,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: accessToken,
            },
            message: 'Login successful',
            status: 200
        };

    }

}
