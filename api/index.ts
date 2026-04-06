import express from "express";
import router from "./backend.ts";

const app = express();
app.use(express.json());

// Mount the API router on /api
app.use("/api", router);

export default app;
