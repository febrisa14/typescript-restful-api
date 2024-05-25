import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest, UpdateUserRequest } from "../model/user.model";
import { UserService } from "../services/user.service";
import { UserRequest } from "../type/user.request";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.register(request);
            res.status(200).json({
                data: response,
                message: "Successfully register"
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const response = await UserService.login(request)
            res.status(200).json({
                data: response,
                message: "Successfully login"
            })
        } catch (error) {
            next(error)
        }
    }

    static async getUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getUser(req.user!)
            res.status(200).json({
                data: response,
                message: "Successfully get data user"
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateUserRequest = req.body
            const response = await UserService.updateUser(request, req.user!)
            res.status(200).json({
                data: response,
                message: "Successfully update data user"
            })
        } catch (error) {
            next(error)
        }
    }

    static async logout(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await UserService.logout(req.user!)
            res.status(200).json({
                data: response,
                message: "Successfully logout"
            })
        } catch (error) {
            next(error)
        }
    }
}