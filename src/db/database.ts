import { PrismaClient } from "@prisma/client";
import { logger } from "../logs/logging";

export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'stdout',
            level: 'error',
        },
        {
            emit: 'stdout',
            level: 'info',
        },
        {
            emit: 'stdout',
            level: 'warn',
        },
    ],
})

prisma.$on("error", (e) => {
    logger.error(e)
})

prisma.$on("warn", (e) => {
    logger.warn(e)
})

prisma.$on("info", (e) => {
    logger.info(e)
})

prisma.$on("query", (e) => {
    logger.info(e)
})