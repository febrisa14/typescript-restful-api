import express from "express";
import { authMiddleware } from "../app/middleware/auth.middleware";
import { UserController } from "../app/controllers/user.controller";
import { ContactController } from "../app/controllers/contact.controller";
import { AddressController } from "../app/controllers/address.controller";

export const apiRouter = express.Router()

//assign middleware to route
apiRouter.use(authMiddleware)

//api users
apiRouter.get("/api/users/current", UserController.getUser)
apiRouter.patch("/api/users", UserController.updateUser)
apiRouter.delete("/api/logout", UserController.logout)

//api contact
apiRouter.post("/api/contacts", ContactController.createContact)
apiRouter.patch("/api/contacts", ContactController.updateContact)
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.getContact)
apiRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.deleteContact)
apiRouter.get("/api/contacts", ContactController.searchContact)

//api address
apiRouter.post("/api/address", AddressController.createAddress)