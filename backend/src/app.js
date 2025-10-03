import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config({
    path: "./.env",
});

const app = express();

//middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5000",
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(cookieParser());

// routes import
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

// routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/message", messageRoutes);

export default app;
