import { hash, compare } from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../services/User";
import dotenv from "dotenv";
dotenv.config();

export class Auth {
    private async _encrypt (password: string): Promise<string> {
        return (await hash(password, 15)).toString();
    }

    private async _decrypt (password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }

    private _generateToken (payLoad: JwtPayload): string {
        return jwt.sign(payLoad, process.env.TOKEN_JWT ?? "", { expiresIn: "1m" });
    }

    private _verifyToken (token: string) {
        return jwt.verify(token, process.env.TOKEN_JWT ?? "");
    }

    private async _verifyUserAdmin (username: string) {
        const user = await User.getUser(username);
        return user ? user.admin ? true : false: false;
    }


    
    public async encrypt(password: string): Promise<string> {
        return this._encrypt(password);
    }

    public async decrypt(password: string, hash: string): Promise<boolean> {
        return this._decrypt(password, hash);
    }

    public generateToken(payLoad: JwtPayload): string {
        return this._generateToken(payLoad);
    }

    public verifyToken(token: string) {
        return this._verifyToken(token);
    }

    public verifyUserAdmin (username: string) {
       return this._verifyUserAdmin(username);
    }
}
