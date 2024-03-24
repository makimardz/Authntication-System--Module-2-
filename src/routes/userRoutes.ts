import { UserController } from "../controllers/userController";
import { Router } from "express";
const router = Router();
const User = new UserController();

router.use('/users', User.routes());

export default router;