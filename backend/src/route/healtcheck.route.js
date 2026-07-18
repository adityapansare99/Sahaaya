import { Router } from "express";
import { healthcheck, publicStats } from "../controller/healthcheck.controller.js";

const router=Router();

router.route("/").get(healthcheck);
router.route("/stats").get(publicStats);

export default router;