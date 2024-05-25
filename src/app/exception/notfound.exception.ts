import { NextFunction, Request, Response } from "express";

export const notFoundException = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "Route Not Found"
    })
}