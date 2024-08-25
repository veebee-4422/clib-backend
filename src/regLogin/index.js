import { Router } from "express";
import RegisterLoginController from "./controller.js";

export default function adminRoutes(){
    const router = Router();

    const controller = new RegisterLoginController();

    return router;
};