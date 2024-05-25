import express from "express";
import { publicRouter } from "../router/public.api";
import { errorMiddleware } from "./middleware/error.middleware";
import { apiRouter } from "../router/api";
import { notFoundException } from "./exception/notfound.exception";

export const app = express();
app.use(express.json())

//router
app.use(publicRouter)
app.use(apiRouter)

app.use(
    errorMiddleware,
    notFoundException
)