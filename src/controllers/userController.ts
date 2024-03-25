import { User } from "../services/User";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { Response, Router, Request } from "express";
const router = Router();

export class UserController extends AuthMiddleware {
    constructor() {
        super(); // Call the constructor of the base class AuthMiddleware
        // Bind route handlers to the current instance
        this.createUser = this.createUser.bind(this);
        this.login = this.login.bind(this);
    }
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
        
        } catch (error: any) {
            // Handle the error
            console.error("An error occurred:", error.message);
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
