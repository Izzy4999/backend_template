import express from "express";
import cors from "cors";
import routes from "@routes/index";
import { env } from "@utils/env";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("API running 🚀"));
app.use("/api", routes);

export default app;
