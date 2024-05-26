import supertest from "supertest"
import { app } from "../../src/app/app"
import { AddressTest, ContactTest, UserTest } from "../test.utils"
import { logger } from "../../src/logs/logging"

export const AddressUnitTest = () => {
    describe("Running All Unit Test in Address", () => {
        describe("POST /api/contacts/:contactId/address", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
            })

            afterEach(async () => {
                await AddressTest.deleteAll()
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be able create new address from contact", async () => {
                const contact = await ContactTest.get()

                const response = await supertest(app)
                    .post(`/api/contacts/${contact.id}/address`)
                    .set("Authorization", "test")
                    .send({
                        street: "street test",
                        city: "city test",
                        province: "province test",
                        country: "country test",
                        postal_code: "23231",
                    })

                logger.debug(response.body)
                expect(response.status).toBe(201)
                expect(response.body.data.street).toEqual("street test")
            })

            it("should not be able to create new address from contact if contact id is invalid", async () => {
                const contact = await ContactTest.get()

                const response = await supertest(app)
                    .post(`/api/contacts/${contact.id + 1}/address`)
                    .set("Authorization", "test")
                    .send({
                        street: "street test",
                        city: "city test",
                        province: "province test",
                        country: "country test",
                        postal_code: "23231",
                    })

                logger.debug(response.body)
                expect(response.status).toBe(404)
                expect(response.body.errors).toBeDefined()
            })
        })
        describe("GET /api/contacts/:contactId/address/:addressId", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
                await AddressTest.create()
            })

            afterEach(async () => {
                await AddressTest.deleteAll()
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be able to get address from contact", async () => {
                const contact = await ContactTest.get()
                const address = await AddressTest.get()

                const response = await supertest(app)
                    .get(`/api/contacts/${contact.id}/address/${address.id}`)
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.street).toEqual("street test")
            })

            it("should not be able to get address from contact if contact id is invalid and address id invalid", async () => {
                const contact = await ContactTest.get()
                const address = await AddressTest.get()

                const response = await supertest(app)
                    .get(`/api/contacts/${contact.id + 1}/address/${address.id + 1}`)
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(404)
                expect(response.body.errors).toBeDefined()
            })
        })

        describe("PUT /api/contacts/:contactId/address/:addressId", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
                await AddressTest.create()
            })

            afterEach(async () => {
                await AddressTest.deleteAll()
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be able to update address from contact", async () => {
                const contact = await ContactTest.get()
                const address = await AddressTest.get()

                const response = await supertest(app)
                    .put(`/api/contacts/${contact.id}/address/${address.id}`)
                    .set("Authorization", "test")
                    .send({
                        street: "street test coba ubah",
                        country: "Indo",
                        postal_code: "82901"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.street).toEqual("street test coba ubah")
                expect(response.body.data.country).toEqual("Indo")
            })
        })

        describe("DELETE /api/contacts/:contactId/address/:addressId", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
                await AddressTest.create()
            })

            afterEach(async () => {
                await AddressTest.deleteAll()
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be able to delete address from contact", async () => {
                const contact = await ContactTest.get()
                const address = await AddressTest.get()

                const response = await supertest(app)
                    .delete(`/api/contacts/${contact.id}/address/${address.id}`)
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.message).toBeDefined()
            })
        })
    })
}