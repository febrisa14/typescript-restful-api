import { Address, User } from "@prisma/client";
import { AddressResource, AddressResponse, CreateAddressRequest, DeleteAddressRequest, GetAddressRequest, UpdateAddressRequest } from "../model/address.model";
import { AddressValidation } from "../validation/address.validation";
import { Validation } from "../validation/validation";
import { ContactService } from "./contact.service";
import { prisma } from "../../db/database";
import { ErrorResponse } from "../errors/error";

export class AddressService {
    static async create(request: CreateAddressRequest, user: User): Promise<AddressResponse> {
        const addressRequest = Validation.validate(AddressValidation.CREATE, request);

        await ContactService.checkContactExist(addressRequest.contact_id, user.username);

        const address = await prisma.address.create({
            data: addressRequest
        })

        return AddressResource(address)
    }

    static async findAddress(id: number, contactId: number): Promise<Address> {
        const address = await prisma.address.findFirst({
            where: {
                id,
                contact_id: contactId
            }
        })

        if (!address) {
            throw new ErrorResponse(404, "Address not found")
        }

        return address
    }

    static async getAddressIdByContactId(request: GetAddressRequest, user: User): Promise<AddressResponse> {
        const addressRequest = Validation.validate(AddressValidation.GET, request)

        await ContactService.checkContactExist(addressRequest.contact_id, user.username)

        const address = await this.findAddress(addressRequest.id, addressRequest.contact_id)

        return AddressResource(address)
    }

    static async updateAddress(request: UpdateAddressRequest, user: User): Promise<AddressResponse> {
        const addressRequest = Validation.validate(AddressValidation.UPDATE, request)

        //check contact exists
        await ContactService.checkContactExist(addressRequest.contact_id, user.username)

        //check address exists
        await this.findAddress(addressRequest.id, addressRequest.contact_id)

        const address = await prisma.address.update({
            where: {
                id: addressRequest.id
            },
            data: addressRequest
        })

        return AddressResource(address)
    }

    static async deleteAddress(request: DeleteAddressRequest, user: User): Promise<AddressResponse> {
        const deleteRequest = Validation.validate(AddressValidation.DELETE, request)

        await ContactService.checkContactExist(deleteRequest.contact_id, user.username)

        await this.findAddress(deleteRequest.id, deleteRequest.contact_id)

        const address = await prisma.address.delete({
            where: {
                id: deleteRequest.id,
                contact_id: deleteRequest.contact_id
            }
        })

        return AddressResource(address)
    }
}