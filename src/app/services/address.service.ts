import { User } from "@prisma/client";
import { AddressResource, AddressResponse, CreateAddressRequest } from "../model/address.model";
import { AddressValidation } from "../validation/address.validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact.service";
import { prisma } from "../../db/database";

export class AddressService {
    static async create(request: CreateAddressRequest, user: User): Promise<AddressResponse> {
        const addressRequest = Validation.validate(AddressValidation.CREATE, request);

        await ContactService.checkContactExist(addressRequest.contact_id, user.username);

        const address = await prisma.address.create({
            data: addressRequest
        })

        return AddressResource(address)
    }
}