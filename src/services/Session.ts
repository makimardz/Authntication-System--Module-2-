import { PrismaClient } from "@prisma/client";

export class Session {
    private prisma = new PrismaClient({
        log: ["query", "info", "warn"]
    }).session;

}