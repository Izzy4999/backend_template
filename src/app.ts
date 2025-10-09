import express from "express";
import cors from "cors";
import routes from "@routes/index";
import { env } from "@utils/env";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const app = express();

app.use(cors());
app.use(express.json());

// Load OpenAPI spec from YAML
const specPath = path.join(process.cwd(), "docs", "openapi.yaml");
const file = fs.readFileSync(specPath, "utf8");
const swaggerDoc = YAML.parse(file);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
app.get("/docs.json", (_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDoc);
});

app.get("/", (_, res) => res.send("API running 🚀"));
app.use("/api", routes);

export default app;
