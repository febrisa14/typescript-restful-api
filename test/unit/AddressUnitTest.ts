import supertest from "supertest"
import { app } from "../../src/app/app"
import { AddressTest, ContactTest, UserTest } from "../test.utils"
import { logger } from "../../src/logs/logging"

export const AddressUnitTest = () => {
    describe("Running All Unit Test in Address", () => {
        describe("POST /api/address", () => {
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
                    .post("/api/address")
                    .set("Authorization", "test")
                    .send({
                        street: "street test",
                        city: "city test",
                        province: "province test",
                        country: "country test",
                        postal_code: "23231",
                        contact_id: contact.id
                    })

                logger.debug(response.body)
                expect(response.status).toBe(201)
                expect(response.body.data.street).toEqual("street test")
            })

            it("should not be able to create new address from contact if contact id is invalid", async () => {
                const contact = await ContactTest.get()

                const response = await supertest(app)
                    .post("/api/address")
                    .set("Authorization", "test")
                    .send({
                        street: "street test",
                        city: "city test",
                        province: "province test",
                        country: "country test",
                        postal_code: "23231",
                        contact_id: contact.id + 1
                    })

                logger.debug(response.body)
                expect(response.status).toBe(404)
                expect(response.body.errors).toBeDefined()
            })
        })
    })
}