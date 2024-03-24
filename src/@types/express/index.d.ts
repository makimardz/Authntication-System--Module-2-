declare namespace Express {
    interface Request {
        user?: {
            username: string;
        }

        body?: {
            name: string;
            username: string;
            password: string;
        }
    }           
}