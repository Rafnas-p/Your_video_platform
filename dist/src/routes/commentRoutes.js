"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddelware_1 = __importDefault(require("../middelware/authMiddelware"));
const router = express_1.default.Router();
router.post("/addComment/:videoId", authMiddelware_1.default, commentController_1.addComment);
router.delete("/deleteComment/:id", commentController_1.deleteComment);
router.get("/getCommentsById/:videoId", commentController_1.getCommentsById);
exports.default = router;
