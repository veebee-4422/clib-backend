import { Router } from "express";
import { getHomepageData } from "./controllers.js";

export default function homepageRoutes() {
    const router = Router();

    router.get("/get-data", getHomepageData);

    return router;
};