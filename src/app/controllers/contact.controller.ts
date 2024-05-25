import { NextFunction, Response } from "express";
import { ContactService } from "../services/contact.service";
import { UserRequest } from "../type/user.request";
import { CreateContactRequest, SearchContactRequest, UpdateContactRequest } from "../model/contact.model";

export class ContactController {
    static async createContact(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: CreateContactRequest = req.body as CreateContactRequest;
            const response = await ContactService.create(request, req.user!)
            res.status(201).json({
                data: response,
                message: "Successfully create contacts"
            })
        } catch (error) {
            next(error)
        }
    }

    static async getContact(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await ContactService.get(req.user!, Number(req.params.contactId))
            res.status(200).json({
                data: response,
                message: "Successfully get contact by id"
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateContact(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateContactRequest = req.body as UpdateContactRequest
            const response = await ContactService.update(request, req.user!)
            res.status(200).json({
                data: response,
                message: "Successfully update contact by id"
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteContact(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await ContactService.delete(Number(req.params.contactId), req.user!)
            res.status(200).json({
                data: response,
                message: "Successfully delete contact by id"
            })
        } catch (error) {
            next(error)
        }
    }

    static async searchContact(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: SearchContactRequest = {
                name: req.query.name as string,
                email: req.query.email as string,
                phone: req.query.phone as string,
                page: req.query.page ? Number(req.query.page) : 1,
                size: req.query.size ? Number(req.query.size) : 10
            }
            const response = await ContactService.search(request, req.user!)
            res.status(200).json(response)
        } catch (error) {

        }
    }
}