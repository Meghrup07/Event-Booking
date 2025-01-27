import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class User {

    @Prop({
        required: true,
        unique: true,
    })
    userName: string;

    @Prop({
        required: true
    })
    firstName: string;

    @Prop({
        required: true
    })
    lastName: string;

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({
        required: true,
        default: 'user'
    })
    role: string;

    @Prop({
        required: false,
        default: null,
    })
    token: string;

    @Prop({
        required: false,
        default: false,
    })
    isTokenExpire: boolean;

}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User);