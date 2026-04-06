import express from "express";
import router from "./backend.ts";

const app = express();
app.use(express.json());

// Em vez de montar em /api (o que duplicaria a rota), 
// montamos na raiz do Handler da Vercel.
app.use("/", router);

export default app;
