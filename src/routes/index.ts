import { Application } from "express";
import UserRoutes from "./userRoutes";

export const routes = (app: Application) => {
    app.use(
        UserRoutes
    );
}
