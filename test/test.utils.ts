import { User, Contact, Address } from '@prisma/client';
import { prisma } from "../src/db/database";
import bcrypt from 'bcrypt';

export class UserTest {
    static async delete() {
        await prisma.user.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    static async create() {

        await prisma.user.create({
            data: {
                username: "test",
                name: "test",
                password: await bcrypt.hash("test", 10),
                token: "test"
            }
        })

    }

    static async get(): Promise<User> {
        const user = await prisma.user.findFirst({
            where: {
                username: "test"
            }
        })

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }
}

export class ContactTest {
    static async create() {
        await prisma.contact.create({
            data: {
                first_name: "contact test",
                last_name: "hello",
                username: "test",
                email: "test@email.com",
                phone: "081123123"
            }
        })
    }
    static async deleteAll() {
        await prisma.contact.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    static async get(): Promise<Contact> {
        const contact = await prisma.contact.findFirst({
            where: {
                first_name: "contact test",
                last_name: "hello",
                email: "test@email.com",
                username: "test"
            }
        })

        if (!contact) {
            throw new Error("Contact not found")
        }

        return contact
    }
}

export class AddressTest {
    static async deleteAll() {
        await prisma.address.deleteMany({
            where: {
                Contact: {
                    username: "test"
                }
            }
        })
    }

    static async get(): Promise<Address> {
        const contact = await ContactTest.get()

        const address = await prisma.address.findFirst({
            where: {
                contact_id: contact!.id
            }
        })

        if (!address) {
            throw new Error("Address not found")
        }

        return address
    }

    static async create() {
        const contact = await ContactTest.get()

        await prisma.address.create({
            data: {
                contact_id: contact!.id,
                street: "street test",
                city: "city test",
                province: "province test",
                country: "country test",
                postal_code: "23231",
            }
        })
    }
}