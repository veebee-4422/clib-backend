import { Router } from "express";
import adminRoutes from "./admin/routes.js";
import userAuthRoutes from "./userAuth/routes.js";

const router = Router();

router.use("/api/v1/admin", adminRoutes());

router.use("/api/v1/user-auth", userAuthRoutes());

export default router;