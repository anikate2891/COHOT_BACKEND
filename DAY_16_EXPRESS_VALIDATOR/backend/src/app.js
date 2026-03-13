import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import {handleError} from './middlewares/error.middleware.js'

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.use(handleError);
export default app;