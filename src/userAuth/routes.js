import { Router } from "express";
import { loginUser, registerUser } from "./controllers.js";
import { parseMultipartFormData } from "../middleware/multerMiddleware.js";

export default function userAuthRoutes() {
    const router = Router();

    router.post("/register", parseMultipartFormData, registerUser);

    router.post("/login", parseMultipartFormData, loginUser);

    return router;
};