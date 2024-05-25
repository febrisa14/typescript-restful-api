import { Contact, User } from "@prisma/client";
import { prisma } from "../../db/database";
import { ContactResource, ContactResponse, CreateContactRequest, SearchContactRequest, UpdateContactRequest } from '../model/contact.model';
import { ContactValidation } from "../validation/contact.validation";
import { Validation } from "../validation/validation";
import { logger } from "../../logs/logging";
import { ErrorResponse } from "../errors/error";
import { Pageable } from "../utils/pagination";

export class ContactService {
    static async create(request: CreateContactRequest, user: User): Promise<ContactResponse> {
        const contactRequest = Validation.validate(ContactValidation.CREATE, request);

        const contact = await prisma.contact.create({
            data: { ...contactRequest, username: user.username }
        })

        return ContactResource(contact)
    }

    static async get(user: User, id: number): Promise<ContactResponse> {
        const contact = await prisma.contact.findUnique({
            where: {
                id,
                username: user.username,
            }
        })

        if (!contact) {
            throw new ErrorResponse(404, "Contact not found")
        }

        return ContactResource(contact)
    }

    static async checkContactExist(contactId: number, username: string): Promise<Contact> {
        const contact = await prisma.contact.findFirst({
            where: {
                id: contactId,
                username
            }
        })

        if (!contact) {
            throw new ErrorResponse(404, "Contact not found")
        }

        return contact
    }

    static async update(request: UpdateContactRequest, user: User): Promise<ContactResponse> {
        const updateRequest = Validation.validate(ContactValidation.UPDATE, request)

        await this.checkContactExist(updateRequest.id, user.username)

        const contact = await prisma.contact.update({
            where: {
                id: updateRequest.id,
                username: user.username
            },
            data: updateRequest
        })

        return ContactResource(contact)
    }

    static async delete(id: number, user: User): Promise<ContactResponse> {
        await this.checkContactExist(id, user.username)

        const contact = await prisma.contact.delete({
            where: {
                id,
                username: user.username
            }
        })

        return ContactResource(contact)
    }

    static async search(request: SearchContactRequest, user: User): Promise<Pageable<ContactResponse>> {
        const searchRequest = Validation.validate(ContactValidation.SEARCH, request)

        const skip = (searchRequest.page - 1) * searchRequest.size

        const filters = [];

        if (searchRequest.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name
                        }
                    },
                    {
                        last_name: {
                            contains: searchRequest.name
                        }
                    }
                ]
            })
        }

        if (searchRequest.email) {
            filters.push({
                email: {
                    contains: searchRequest.email,
                }
            })
        }

        if (searchRequest.phone) {
            filters.push({
                phone: {
                    contains: searchRequest.phone,
                }
            })
        }

        const contacts = await prisma.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take: searchRequest.size,
            skip
        })

        const total = await prisma.contact.count({
            where: {
                username: user.username,
                AND: filters
            },
        })

        return {
            data: contacts.map(contact => ContactResource(contact)),
            paging: {
                current_page: searchRequest.page,
                total_page: Math.ceil(total / searchRequest.size),
                size: searchRequest.size
            }
        }
    }
}