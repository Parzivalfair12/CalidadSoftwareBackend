import { LoginController } from "../controllers/LoginController";
import { Router } from "express";

const router = Router();

router.post("/", LoginController.Login);

export default router;
