import { Request, Response, NextFunction } from "express";
import { Auth } from "../auth/auth";
import { JsonWebTokenError, TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import { User } from "../services/User";

// Define a new type by extending the existing Request type
interface AuthenticatedRequest extends Request {
    user?: {
        username: string; // Modify this according to your user object structure
    };
}
const auth = new Auth();

export class AuthMiddleware {
    protected async verifyUserIsAdmin (req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if(req.user) {
                const { username } = req.user;
                const isAdmin = await auth.verifyUserAdmin(username);

                if(!isAdmin) {
                    return res.status(401).json({ message: "Access is denied, if you think this is an error, contact support." })
                }
                    
                return next();
            }
            
            return res.status(401).json({ message: "Access is denied, if you think this is an error, contact support." })
            
            
        } catch (err) {
            console.error(err);
        }   
    }

    protected async verifyIfAlreadyLogged (req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers;

            if (authorization) {
                const validation = auth.verifyToken(authorization) as JwtPayload;
                if (validation) {
                    req.user = {
                        username: validation.username
                    }

                    return next();
                }
                    
            }

        } catch (err) {
            if((err as JsonWebTokenError).name === "JsonWebTokenError") {
                return res.status(400).json({ message: "Invalid session token." });
            } if ((err as TokenExpiredError).name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token Expired" });
            } else {
                return res.status(500).json({ message: "uncknow error." });
            }
        }
    }

}   