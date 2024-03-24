import { PrismaClient } from "@prisma/client";
import { Auth } from "../auth/auth";

const prisma = new PrismaClient();
const auth = new Auth();

export class User {
    private _admin: boolean = false;

    constructor(
        private _name: string,
        private _username: string,
        private _password: string,
        private _id?: number
    ) {}

    public static async getUser(username: string): Promise<any | null> {
        try {
            return await prisma.user.findUnique({
                where: {
                    username
                }
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }

    public async create(): Promise<void> {
        try {
            await prisma.user.create({
                data: {
                    name: this._name,
                    username: this._username,
                    admin: this._admin,
                    password: await auth.encrypt(this._password)
                }
            });
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Could not create user");
        }
    }

    public async login(password: string): Promise<string | boolean> {
        try {
            const compare: boolean = await auth.decrypt(password, this._password);

            if (compare && this._id) {
                return auth.generateToken({
                    id: this._id,
                    name: this._name,
                    username: this._username
                });
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return false;
        }
    }
}