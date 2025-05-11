import Express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { ConnectDB } from "./config/db";
import MetricRoutes from "./routes/MetricRoutes";
import LoginRoutes from "./routes/LoginRoutes"

dotenv.config();

//Connect to mongo
ConnectDB();

const app = Express();
app.use(cors(corsConfig));
app.use(Express.json());

//Routes
app.use("/api/metrics/", MetricRoutes);
app.use("/api/login/", LoginRoutes);

export default app;
