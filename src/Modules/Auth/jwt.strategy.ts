import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { AuthRepository } from "./Repository/auth.repository";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authRepository: AuthRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }


    async validate(payload: any) {
        const user = await this.authRepository.findByEmail(payload.email);
        if (!user || user.isTokenExpire) {
            throw new UnauthorizedException({
                message: 'Token has expired',
                statu: false
            });
        }
        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        };
    }

}
