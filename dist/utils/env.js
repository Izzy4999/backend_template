"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const envalid_1 = require("envalid");
exports.env = (0, envalid_1.cleanEnv)(process.env, {
    NODE_ENV: (0, envalid_1.str)({ choices: ["development", "production", "test"] }),
    PORT: (0, envalid_1.port)({ default: 4000 }),
    JWT_SECRET: (0, envalid_1.str)(),
    REFRESH_SECRET: (0, envalid_1.str)(),
    EMAIL_USER: (0, envalid_1.str)(),
    EMAIL_PASS: (0, envalid_1.str)(),
    EMAIL_FROM: (0, envalid_1.str)(),
});
