import { Router } from "express";
import adminRoutes from "./admin/index.js";

const router = Router();

router.use("/api/v1/admin", adminRoutes());

export default router;