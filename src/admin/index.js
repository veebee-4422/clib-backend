import { Router } from "express";
import AdminController from "./controller.js";

export default function adminRoutes(){
    const router = Router();

    const controller = new AdminController();

    return router;
};