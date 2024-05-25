import supertest from "supertest"
import { ContactTest, UserTest } from "../test.utils"
import { app } from "../../src/app/app"
import { logger } from "../../src/logs/logging"

export const ContactUnitTest = () => {
    describe("Running All Unit Test in Contact", () => {
        describe("POST /api/contacts", () => {
            beforeEach(async () => {
                await UserTest.create()
            })

            afterEach(async () => {
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be create new contact", async () => {
                const response = await supertest(app)
                    .post("/api/contacts")
                    .set("Authorization", "test")
                    .send({
                        first_name: "contact test",
                        last_name: "hello",
                    })

                logger.debug(response.body)
                expect(response.status).toBe(201)
                expect(response.body.data).toBeDefined()
            })
        })

        describe("GET /api/contacts/:contactId", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
            })

            afterEach(async () => {
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be get contact by id", async () => {
                const contact = await ContactTest.get();

                const response = await supertest(app)
                    .get(`/api/contacts/${contact.id}`)
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data).toBeDefined()
            })
        })

        describe("PATCH /api/contacts", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
            })

            afterEach(async () => {
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be update contact", async () => {
                const contact = await ContactTest.get();

                const response = await supertest(app)
                    .patch(`/api/contacts/`)
                    .set("Authorization", "test")
                    .send({
                        id: contact.id,
                        first_name: "update contact test",
                        last_name: "hello",
                        email: "email@email.com",
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data).toBeDefined()
                expect(response.body.data.first_name).toBe("update contact test")
            })
        })

        describe("DELETE /api/contacts/:contactId", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
            })

            afterEach(async () => {
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be delete contact", async () => {
                const contact = await ContactTest.get();

                const response = await supertest(app)
                    .delete(`/api/contacts/${contact.id}`)
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
            })
        })

        describe("GET /api/contacts", () => {
            beforeEach(async () => {
                await UserTest.create()
                await ContactTest.create()
            })

            afterEach(async () => {
                await ContactTest.deleteAll()
                await UserTest.delete()
            })

            it("should be able to search contact", async () => {
                const response = await supertest(app)
                    .get(`/api/contacts`)
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(1)
                expect(response.body.paging).toBeDefined()
                expect(response.body.paging.size).toBe(10)
                expect(response.body.paging.total_page).toBe(1)
                expect(response.body.paging.current_page).toBe(1)
            })

            it("should be able to search name contact", async () => {
                const response = await supertest(app)
                    .get(`/api/contacts`)
                    .set("Authorization", "test")
                    .query({
                        name: "es",
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(1)
                expect(response.body.paging).toBeDefined()
                expect(response.body.paging.size).toBe(10)
                expect(response.body.paging.total_page).toBe(1)
                expect(response.body.paging.current_page).toBe(1)
            })

            it("should be able to search email contact", async () => {
                const response = await supertest(app)
                    .get(`/api/contacts`)
                    .set("Authorization", "test")
                    .query({
                        email: ".com",
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(1)
                expect(response.body.paging).toBeDefined()
                expect(response.body.paging.size).toBe(10)
                expect(response.body.paging.total_page).toBe(1)
                expect(response.body.paging.current_page).toBe(1)
            })

            it("should be able to search name not result in contact", async () => {
                const response = await supertest(app)
                    .get(`/api/contacts`)
                    .set("Authorization", "test")
                    .query({
                        name: "ngawur",
                        email: "ngawur@email.com"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(0)
                expect(response.body.paging).toBeDefined()
                expect(response.body.paging.size).toBe(10)
                expect(response.body.paging.total_page).toBe(0)
                expect(response.body.paging.current_page).toBe(1)
            })

            it("should be able to move to another page in contact", async () => {
                const response = await supertest(app)
                    .get(`/api/contacts`)
                    .set("Authorization", "test")
                    .query({
                        page: 2,
                        size: 1
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data.length).toBe(0)
                expect(response.body.paging).toBeDefined()
                expect(response.body.paging.size).toBe(1)
                expect(response.body.paging.total_page).toBe(1)
                expect(response.body.paging.current_page).toBe(2)
            })
        })
    })
}