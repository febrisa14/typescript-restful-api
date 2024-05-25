import { NextFunction, Response, Request } from "express";
import { prisma } from "../../db/database";
import { UserRequest } from "../type/user.request";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.get("Authorization")

    if (token) {
        const user = await prisma.user.findFirst({
            where: {
                token: token
            }
        })

        if (user) {
            req.user = user
            next();
            return;
        }
    }

    res.status(401).json({
        message: "Unauthorized"
    }).end()
}