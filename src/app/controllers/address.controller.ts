import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user.request";
import { CreateAddressRequest, DeleteAddressRequest, GetAddressRequest, UpdateAddressRequest } from "../model/address.model";
import { AddressService } from "../services/address.service";
import { logger } from "../../logs/logging";

export class AddressController {
    static async createAddress(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateAddressRequest = {
                ...req.body as CreateAddressRequest,
                contact_id: Number(req.params.contactId)
            }
            const response = await AddressService.create(request, req.user!)
            res.status(201).json({
                data: response,
                message: "Success create address"
            })
        } catch (error) {
            next(error)
        }
    }

    static async getAddress(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: GetAddressRequest = {
                contact_id: Number(req.params.contactId),
                id: Number(req.params.addressId)
            }
            const response = await AddressService.getAddressIdByContactId(request, req.user!)
            res.status(200).json({
                data: response,
                message: "Success get address by id"
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateAddress(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateAddressRequest = req.body as UpdateAddressRequest
            request.id = Number(req.params.addressId)
            request.contact_id = Number(req.params.contactId)
            const response = await AddressService.updateAddress(request, req.user!)
            res.status(200).json({
                data: response,
                message: "Successfully update address by id"
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteAddress(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: DeleteAddressRequest = {
                contact_id: Number(req.params.contactId),
                id: Number(req.params.addressId)
            }
            logger.debug("request delete address", request)
            await AddressService.deleteAddress(request, req.user!)
            res.status(200).json({
                message: "Successfully delete address by id"
            })
        } catch (error) {
            next(error)
        }
    }
}