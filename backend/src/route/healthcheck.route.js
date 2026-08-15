import { Router } from "express";
import {
  healthcheck,
  publicStats,
  logout,
} from "../controller/healthcheck.controller.js";

const router = Router();

router.route("/").get(healthcheck);
router.route("/stats").get(publicStats);
router.route("/logout").post(logout);

export default router;
