import express from 'express';
import { UserController } from '../app/controllers/user.controller';

export const publicRouter = express.Router();

publicRouter.post("/api/users", UserController.register)
publicRouter.post("/api/auth", UserController.login)