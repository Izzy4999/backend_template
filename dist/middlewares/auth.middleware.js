"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = (0, jwt_1.verifyAccessToken)(token);
    if (!decoded) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
};
exports.authMiddleware = authMiddleware;
