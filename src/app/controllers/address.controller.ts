import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user.request";
import { CreateAddressRequest } from "../model/address.model";
import { AddressService } from "../services/address.service";

export class AddressController {
    static async createAddress(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateAddressRequest = req.body as CreateAddressRequest
            const response = await AddressService.create(request, req.user!)
            res.status(201).json({
                data: response,
                message: "Success create address"
            })
        } catch (error) {
            next(error)
        }
    }
}