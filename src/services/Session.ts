import { PrismaClient } from "@prisma/client";

export class Session {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient({
            log: ["query", "info", "warn"]
        });
    }

    // Add methods to interact with the session data if needed
}