import supertest from "supertest"
import { app } from '../../src/app/app';
import { logger } from "../../src/logs/logging";
import { UserTest } from "../test.utils";
import bcrypt from 'bcrypt';

export const UserUnitTest = () => {
    describe("Running All Unit Test in User", () => {
        describe("POST /api/users", () => {
            afterEach(async () => {
                await UserTest.delete();
            })

            it("should reject register new user if request is invalid", async () => {
                const response = await supertest(app)
                    .post("/api/users")
                    .send({
                        username: "",
                        password: "",
                        name: ""
                    })

                logger.debug(response.body)
                expect(response.status).toBe(400)
                expect(response.body.errors).toBeDefined()
            })

            it("should register new user", async () => {
                const response = await supertest(app)
                    .post("/api/users")
                    .send({
                        username: "test",
                        name: "test",
                        password: "12345678"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data).toBeDefined()
                expect(response.body.data.username).toBe("test")
                expect(response.body.data.name).toBe("test")
            })
        })

        describe("POST /api/auth", () => {
            beforeEach(async () => {
                await UserTest.create()
            })

            afterEach(async () => {
                await UserTest.delete()
            })

            it("should reject login new user if request is invalid", async () => {
                const response = await supertest(app)
                    .post("/api/auth")
                    .send({
                        username: "halo",
                        password: "halo"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(401)
            })

            it("should success login user", async () => {
                const response = await supertest(app)
                    .post("/api/auth")
                    .send({
                        username: "test",
                        password: "test"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data).toBeDefined()
                expect(response.body.data.username).toBe("test")
                expect(response.body.data.name).toBe("test")
                expect(response.body.data.token).toBeDefined()
            })
        })

        describe("GET /api/users/current", () => {
            beforeEach(async () => {
                await UserTest.create()
            })

            afterEach(async () => {
                await UserTest.delete()
            })

            it("should be able to see current user login", async () => {
                const response = await supertest(app)
                    .get("/api/users/current")
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
            })
        })

        describe("PATCH /api/users", () => {
            beforeEach(async () => {
                await UserTest.create()
            })

            afterEach(async () => {
                await UserTest.delete()
            })

            it("should reject update user if unauthorized", async () => {
                const response = await supertest(app)
                    .patch("/api/users")
                    .send({
                        name: "hello",
                        password: "12345678"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(401)
                expect(response.body.message).toBe("Unauthorized")
            })

            it("should be able to update information for current user login", async () => {
                const response = await supertest(app)
                    .patch("/api/users")
                    .set("Authorization", "test")
                    .send({
                        name: "hello",
                        password: "12345678"
                    })

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data).toBeDefined()
                expect(response.body.data.name).toBe("hello")

                const user = await UserTest.get()
                expect(await bcrypt.compare("12345678", user.password)).toBe(true)
            })
        })

        describe("DELETE /api/logout", () => {
            beforeEach(async () => {
                await UserTest.create()
            })

            afterEach(async () => {
                await UserTest.delete()
            })

            it("should reject logout for invalid token", async () => {
                const response = await supertest(app)
                    .delete("/api/logout")
                    .set("Authorization", "hello")

                logger.debug(response.body)
                expect(response.status).toBe(401)
                expect(response.body.message).toBe("Unauthorized")
            })

            it("should be able to logout for current user login", async () => {
                const response = await supertest(app)
                    .delete("/api/logout")
                    .set("Authorization", "test")

                logger.debug(response.body)
                expect(response.status).toBe(200)
                expect(response.body.data).toBeDefined()

                const user = await UserTest.get()
                expect(user.token).toBeNull()
            })
        })
    })
}