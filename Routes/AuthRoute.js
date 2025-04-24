import express from "express";
import { onChangePassword, onLoginUser, onRegister, onVerificationOtp, sendOtp } from "../Controllers/AuthController.js";

const router = express.Router();

router.post("/reg", onRegister);

router.post("/login", onLoginUser);

router.post('/send' , sendOtp)

router.post('/verify' , onVerificationOtp)

router.post('/passreset' , onChangePassword)

export default router;
