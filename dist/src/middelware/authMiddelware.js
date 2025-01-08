"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebaseAdmin_1 = __importDefault(require("../../firebase/firebaseAdmin"));
const Users_1 = __importDefault(require("../models/Users"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const mongoDbId = req.headers["x-mongodb-id"];
        if (!authHeader || !mongoDbId) {
            res.status(401).json({ message: "Unauthorized: Missing token or MongoDB ID" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = yield firebaseAdmin_1.default.auth().verifyIdToken(token);
        const user = yield Users_1.default.findById(mongoDbId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.uid !== decodedToken.uid) {
            res.status(403).json({ message: "Unauthorized: User mismatch" });
            return;
        }
        req.user = user._id.toString();
        req.uid = user.uid;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});
exports.default = authMiddleware;
