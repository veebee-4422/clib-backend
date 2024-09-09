import { Router } from "express";
import adminRoutes from "./admin/routes.js";
import userAuthRoutes from "./userAuth/routes.js";
import homepageRoutes from "./homepage/routes.js";

const router = Router();

router.use("/api/v1/admin", adminRoutes());

router.use("/api/v1/user-auth", userAuthRoutes());

router.use("/api/v1/homepage", homepageRoutes());

export default router;