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
exports.deleteShortsById = exports.deleteVideoById = exports.getChannelsByName = exports.getChannels = exports.createChannel = exports.imageUpload = exports.UpdateShortsByID = exports.UpdateVideoByID = exports.getShortsById = exports.getVideoById = exports.getEntairShorts = exports.getEntairVideos = exports.getAllShorts = exports.getAllVideos = void 0;
const Video_1 = __importDefault(require("../models/Video"));
const Shorts_1 = __importDefault(require("../models/Shorts"));
const Channel_1 = __importDefault(require("../models/Channel"));
const Users_1 = __importDefault(require("../models/Users"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const uploadimag_1 = require("../Cloudnary/uploadimag");
const getAllVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId) {
            throw new Error("Please logIn");
        }
        const videos = yield Video_1.default.find({ userId }).populate('userId');
        res.status(200).json({ videos });
    }
    catch (error) {
        console.error("Error fetching videos:", error.message);
        res.status(500).json({ error: error.message || "Failed to fetch videos." });
    }
});
exports.getAllVideos = getAllVideos;
const getAllShorts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId) {
            throw new Error("please logIn");
        }
        const shorts = yield Shorts_1.default.find({ userId });
        res.status(200).json({ shorts });
    }
    catch (error) {
        console.error("Error fetching Shorts:", error.message);
        res.status(500).json({ error: error.message || "Failed to fetch Shorts." });
    }
});
exports.getAllShorts = getAllShorts;
const getEntairVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video_1.default.find().populate("userId").populate('channelId');
        res.status(200).json({ videos });
    }
    catch (error) {
        console.error('Error fetching videos:', error.message);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
exports.getEntairVideos = getEntairVideos;
const getEntairShorts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shorts = yield Shorts_1.default.find().populate("userId").populate('channelId');
        res.status(200).json({ success: true, shorts });
    }
    catch (error) {
        console.error("Error fetching shorts:", error.message);
        res.status(500).json({ success: false, error: error.message || "Failed to fetch Shorts" });
    }
});
exports.getEntairShorts = getEntairShorts;
const getVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoId } = req.params;
        const video = yield Video_1.default.findById(videoId).populate("userId").populate("channelId");
        res.status(200).json(video);
    }
    catch (error) {
        console.error("error fetching One video:", error.message);
        res.status(500).json({ error: error.message || "Failed to fetch Shorts" });
    }
});
exports.getVideoById = getVideoById;
const getShortsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shortsId } = req.params;
        const shorts = yield Shorts_1.default.findById(shortsId);
        if (!shorts) {
            res.status(404).json({ message: "Shorts not found" });
        }
        res.status(200).json(shorts);
    }
    catch (error) {
        console.error("Error fetching Shorts video:", error.message);
        res.status(500).json({ error: error.message || "Failed to fetch Shorts video" });
    }
});
exports.getShortsById = getShortsById;
const UpdateVideoByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const { videoId } = req.params;
        const updatedVideo = yield Video_1.default.findByIdAndUpdate(videoId, { title, description }, { new: true });
        if (!updatedVideo) {
            res.status(404).json({ message: "Video not found" });
        }
        res.json(updatedVideo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.UpdateVideoByID = UpdateVideoByID;
const UpdateShortsByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const { shortsId } = req.params;
        const updatedShorts = yield Shorts_1.default.findByIdAndUpdate(shortsId, { title, description }, { new: true });
        if (!updatedShorts) {
            res.status(404).json({ message: "Shorts not found" });
        }
        res.json(updatedShorts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.UpdateShortsByID = UpdateShortsByID;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../../profile/images');
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
exports.imageUpload = upload.single('image');
const createChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, handil, photoURL } = req.body;
    const userId = req.user;
    if (!name || !userId) {
        res.status(400).json({ message: 'Name and ownerId are required.' });
        return;
    }
    const _id = userId;
    try {
        const owner = yield Users_1.default.findOne({ _id });
        if (!owner) {
            res.status(404).json({ message: 'Owner not found.' });
            return;
        }
        const existingChannel = yield Channel_1.default.findOne({ name, userId: userId });
        if (existingChannel) {
            res.status(400).json({ message: 'Channel with the same name already exists.' });
            return;
        }
        let profile = photoURL;
        if (req.file) {
            const filePath = req.file.path;
            const uploadResult = yield (0, uploadimag_1.uploadImage)(filePath);
            profile = uploadResult.secure_url;
            fs_1.default.unlinkSync(filePath); // Delete local file after upload
        }
        const channel = new Channel_1.default({
            name,
            userId: userId,
            profile,
            handil,
        });
        yield channel.save();
        res.status(201).json({
            message: 'Channel created successfully!',
            channel,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
});
exports.createChannel = createChannel;
const getChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ownerId } = req.query;
    if (!ownerId) {
        res.status(400).json({ message: 'ownerId is required.' });
        return;
    }
    try {
        const channels = yield Channel_1.default.findOne({ userId: ownerId });
        if (!channels) {
            res.status(404).json({ message: 'No channels found for this user.' });
            return;
        }
        res.status(200).json(channels);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
});
exports.getChannels = getChannels;
const getChannelsByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName } = req.query;
    if (!userName) {
        res.status(400).json({ message: 'ownerId is required.' });
        return;
    }
    try {
        const channels = yield Channel_1.default.find({ name: userName });
        if (!channels) {
            res.status(404).json({ message: 'No channels found for this user.' });
            return;
        }
        res.status(200).json(channels);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
});
exports.getChannelsByName = getChannelsByName;
const deleteVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.params);
    if (!id) {
        res.status(404).json({ message: 'No ID provided.' });
        return;
    }
    try {
        const video = yield Video_1.default.findById(id);
        if (!video) {
            res.status(404).json({ message: "Video not found." });
            return;
        }
        const { public_id } = video;
        if (public_id) {
            yield cloudinary_1.v2.uploader.destroy(public_id, { resource_type: "video" });
        }
        yield Video_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Video deleted successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});
exports.deleteVideoById = deleteVideoById;
const deleteShortsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(req.params);
    if (!id) {
        res.status(404).json({ message: 'No ID provided.' });
        return;
    }
    try {
        const video = yield Shorts_1.default.findById(id);
        if (!video) {
            res.status(404).json({ message: "Video not found." });
            return;
        }
        const { public_id } = video;
        if (public_id) {
            yield cloudinary_1.v2.uploader.destroy(public_id, { resource_type: "video" });
        }
        yield Video_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Video deleted successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
});
exports.deleteShortsById = deleteShortsById;
