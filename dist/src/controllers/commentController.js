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
exports.getCommentsById = exports.deleteComment = exports.addComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = __importDefault(require("mongoose"));
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    const { userName, userProfile, text } = req.body;
    const userId = req.user;
    console.log('userId', userId);
    if (!text || !userId || !userName) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const newComment = new Comment_1.default({
            videoId,
            userId,
            userName,
            userProfile,
            text,
        });
        const savedComment = yield newComment.save();
        res.status(201).json(savedComment);
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error });
    }
});
exports.addComment = addComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid comment ID" });
        return;
    }
    try {
        const deletedComment = yield Comment_1.default.findByIdAndDelete(id);
        if (!deletedComment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Error deleting comment", error });
    }
});
exports.deleteComment = deleteComment;
const getCommentsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { videoId } = req.params;
    try {
        const comments = yield Comment_1.default.find({ videoId });
        if (!comments || comments.length === 0) {
            res.json(comments || []);
            return;
        }
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "An error occurred while fetching comments." });
    }
});
exports.getCommentsById = getCommentsById;
