import { User } from "../services/User";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Response, Router, Request } from "express";
const router = Router();

export class UserController extends AuthMiddleware {
    public routes() {
        router.post('/login', this.login);
        router.post('/create', this.verifyIfAlreadyLogged,this.verifyUserIsAdmin,this.createUser);

        return router
    }

    private async createUser (req: Request, res: Response): Promise<void> {
        try {
            const { name, username, password } = req.body;
            const user = new User(name, username, password);

            await user.create();

            res.status(201).json({ message: "User successfully created" });
        
        } catch (err) { 
            if((err as PrismaClientKnownRequestError).code === "P2002") {
                res.status(409).json({ message: "This user already exists" })
            } else if ((err as PrismaClientValidationError).message ) {
                res.json({ message: "Missing field or invalid type field" })
            } else {
                res.status(500).json({ message: "Uncknow error" });
            }
        }        
    }

    private async login (req: Request, res: Response) {
        const { username, password } = req.body;
        
        const data = await User.getUser(username);

        if(data) {
            const user = new User(data.name, data.username, data.password, data.id);
            const login = await user.login(password)
            
            if(!login) {
                return res.status(401).json({ message: "Invalid password" });
            }
            
            return res.status(200).json({ token: login });

        } else {
            return res.status(401).json({ message: "Invalid user" });
        }
        
    }
}
