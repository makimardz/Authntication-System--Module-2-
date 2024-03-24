import { PrismaClient } from "@prisma/client";
import { Auth } from "../auth/auth";
const prisma = new PrismaClient().user;
const auth = new Auth();

export class User{
    private _admin: boolean;
    constructor(
        private _name: string,
        private _username: string,
        private _password: string,
        private _id?: number
    ) {
        this._admin = false;
    }

    public static async getUser(username: string)  {
        return await prisma.findUnique({
            where: {
                username
            }
        })
    }

    public async create (): Promise<void> {  
            await prisma.create({
                data: {
                    name: this._name,
                    username: this._username,
                    admin: this._admin,
                    password: await auth.encrypt(this._password)
                }
            });
    }

    public async login (password: string): Promise<boolean | string> {
        const compare: boolean = await auth.decrypt(password, this._password);
        
        if(this._id) {
            if (compare) {
                return auth.generateToken({
                    id: this._id,
                    name: this._name,
                    username: this._username
                })
            }
            return false;
        }

        return false;
            
    }   
}