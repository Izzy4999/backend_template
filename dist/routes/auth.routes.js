"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     responses:
 *       '200':
 *         description: Token refreshed
 */
router.post("/refresh", auth_controller_1.refreshToken);
/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user and revoke refresh token
 *     responses:
 *       '200':
 *         description: Logged out
 */
router.post("/logout", auth_controller_1.logout);
exports.default = router;
