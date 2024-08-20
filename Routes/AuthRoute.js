import express from "express";
import { onLoginUser, onRegister } from "../Controllers/AuthController.js";

const router = express.Router();

router.post("/reg", onRegister);

router.post("/login", onLoginUser);

export default router;
