import { prisma } from "../../db/database";
import { ErrorResponse } from "../errors/error";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest, userResource } from '../model/user.model';
import { UserValidation } from "../validation/user.validation";
import { Validation } from "../validation/validation";
import bcrypt from "bcrypt";
import { UserResponse } from "../model/user.model";
import { v4 as uuid } from "uuid"
import { User } from "@prisma/client";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request);
        const totalUserWithSameUsername = await prisma.user.count({
            where: {
                username: registerRequest.username
            }
        })

        if (totalUserWithSameUsername != 0) {
            throw new ErrorResponse(400, "Username already exist");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

        const user = await prisma.user.create({
            data: registerRequest
        })

        return userResource(user)
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prisma.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if (!user) {
            throw new ErrorResponse(401, "Username or Password incorrect")
        }

        const checkPassword = await bcrypt.compare(loginRequest.password, user.password);

        if (!checkPassword) {
            throw new ErrorResponse(401, "Username or Password incorrect")
        }

        user = await prisma.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        const response = userResource(user)
        response.token = user.token!
        return response
    }

    static async getUser(user: User): Promise<UserResponse> {
        return userResource(user)
    }

    static async updateUser(request: UpdateUserRequest, user: User): Promise<UserResponse> {
        const updateRequest = Validation.validate(UserValidation.UPDATE, request);

        if (typeof updateRequest.password === "string" && updateRequest.password.length > 0) {
            updateRequest.password = await bcrypt.hash(updateRequest.password, 10);
        }

        const updateUser = await prisma.user.update({
            where: {
                username: user.username
            },
            data: updateRequest
        })

        if (!updateUser) {
            throw new ErrorResponse(500, "Update user failed")
        }

        return userResource(updateUser)
    }

    static async logout(user: User): Promise<UserResponse> {
        const result = await prisma.user.update({
            where: {
                username: user.username
            },
            data: {
                token: null
            }
        })

        return userResource(result)
    }
}