import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send/:id").post(verifyJWT, sendMessage);
router.route("/:id").get(verifyJWT, getMessage);

export default router;
