import { Router } from "express";
import { adminLogin } from "./controllers.js";

export default function adminRoutes(){
    const router = Router();
    
    router.get("/login", adminLogin);

    return router;
};