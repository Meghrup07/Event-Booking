import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateUserDTO } from "src/Modules/User/DTOs/UpdateUserDTO";
import { User, UserDocument } from "src/Entities/User/user.schema";
import { IUserRepository } from "./user.interface";

@Injectable()
export class UserRepository implements IUserRepository {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
        return await this.userModel.findByIdAndUpdate(id, updateUserDTO);
    }

    async findById(id: string) {
        return await this.userModel.findById(id);
    }

    async findAll() {
        return await this.userModel.find();
    }

    async deleteUser(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }

}