import express from "express";
import {
  onEndAttendance,
  onStartingAttendance,
  onStateAttendance,
} from "../Controllers/AttendanceController.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";
import { CheckingUser } from "../Middlewares/CheckingUser.js";

const router = express.Router();

router.post("/start", authenticateToken, CheckingUser, onStartingAttendance);

router.patch(
  "/end/:attendanceId",
  authenticateToken,
  CheckingUser,
  onEndAttendance
);

router.get("/", authenticateToken, CheckingUser, onStateAttendance);

export default router;
