"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const yaml_1 = __importDefault(require("yaml"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Load OpenAPI spec from YAML
const specPath = node_path_1.default.join(process.cwd(), "docs", "openapi.yaml");
const file = node_fs_1.default.readFileSync(specPath, "utf8");
const swaggerDoc = yaml_1.default.parse(file);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc, { explorer: true }));
app.get("/docs.json", (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDoc);
});
app.get("/", (_, res) => res.send("API running 🚀"));
app.use("/api", index_1.default);
exports.default = app;
