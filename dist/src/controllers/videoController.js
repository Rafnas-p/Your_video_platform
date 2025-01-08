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
exports.dislikeVideo = exports.videolikeCount = exports.likeVideo = exports.uploadVideoToCloudinary = exports.videoUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../Cloudnary/config");
const Video_1 = __importDefault(require("../models/Video"));
const Shorts_1 = __importDefault(require("../models/Shorts"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../uploads/videos");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.videoUpload = upload.single("video");
const uploadVideoToCloudinary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No video file uploaded" });
            return;
        }
        const { description, userId, title, category, profil, userName, channelId } = req.body;
        if (!userId || !description) {
            res
                .status(400)
                .json({ message: "Missing required fields: userId or description" });
            return;
        }
        const filePath = req.file.path;
        const result = yield (0, config_1.uploadVideo)(filePath);
        fs_1.default.unlinkSync(filePath);
        let video;
        if (result.duration > 45) {
            video = new Video_1.default({
                description,
                videoUrl: result.secure_url,
                publicId: result.public_id,
                duration: result.duration,
                userId,
                profil,
                userName,
                title,
                category,
                channelId,
            });
            yield video.save();
        }
        else {
            video = new Shorts_1.default({
                description,
                videoUrl: result.secure_url,
                publicId: result.public_id,
                duration: result.duration,
                userId,
                profil,
                title,
                userName,
                category,
                channelId,
                isShort: true,
            });
            yield video.save();
        }
        res.status(200).json({
            message: "Video uploaded and saved successfully",
            data: video,
        });
    }
    catch (error) {
        console.error("Error uploading video:", error.message);
        res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
exports.uploadVideoToCloudinary = uploadVideoToCloudinary;
const likeVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.body;
    const userId = req.user;
    if (!channelId || !userId) {
        res.status(400).json({ message: "User ID and Video ID are required" });
        return;
    }
    try {
        const video = yield Video_1.default.findById(channelId);
        if (!video) {
            res.status(404).json({ message: "Video not found" });
            return;
        }
        if (video.likes.includes(userId)) {
            video.likes = video.likes.filter((userId) => userId !== userId);
            video.dislikes = video.dislikes.filter((userId) => userId !== userId);
            yield video.save();
            res.status(200).json({
                message: "Like removed successfully",
                likesCount: video.likes.length,
                dislikesCount: video.dislikes.length,
                likes: video.likes,
                dislikes: video.dislikes
            });
            return;
        }
        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter((userId) => userId !== userId);
        }
        video.likes.push(userId);
        yield video.save();
        res.status(200).json({
            message: "Video liked successfully",
            likesCount: video.likes.length,
            dislikesCount: video.dislikes.length,
            likes: video.likes,
            dislikes: video.dislikes
        });
    }
    catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.likeVideo = likeVideo;
const videolikeCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    if (!_id) {
        res.status(400).json({ message: " Video ID are required" });
        return;
    }
    try {
        const video = yield Video_1.default.findById(_id);
        if (!video) {
            res.status(404).json({ message: "Video not found" });
            return;
        }
        res.status(200).json({
            likesCount: video.likes.length,
            likes: video.likes,
        });
    }
    catch (error) {
    }
});
exports.videolikeCount = videolikeCount;
const dislikeVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.body;
    const userId = req.user;
    if (!channelId || !userId) {
        res.status(400).json({ message: "User ID and Video ID are required" });
        return;
    }
    try {
        const video = yield Video_1.default.findById(channelId);
        if (!video) {
            res.status(404).json({ message: "Video not found" });
            return;
        }
        if (video.dislikes.includes(userId)) {
            video.dislikes = video.dislikes.filter((uId) => uId !== userId);
            yield video.save();
            res.status(200).json({
                message: "Dislike removed successfully",
                dislikesCount: video.dislikes.length,
                dislikes: video.dislikes,
            });
            return;
        }
        video.dislikes.push(userId);
        if (video.likes.includes(userId)) {
            video.likes = video.likes.filter((uId) => uId !== userId);
        }
        yield video.save();
        res.status(200).json({
            message: "Video disliked successfully",
            dislikesCount: video.likes.length,
            dislikes: video.likes.length,
            dislikarray: video.dislikes
        });
    }
    catch (error) {
        console.error("Error toggling dislike:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.dislikeVideo = dislikeVideo;
