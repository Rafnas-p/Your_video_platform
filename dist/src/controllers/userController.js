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
exports.getSubscribersCount = exports.subscribeChannel = exports.getAllUsers = exports.getUserById = exports.CreatUser = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const Channel_1 = __importDefault(require("../models/Channel"));
const CreatUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, email, displayName, photoURL, channelName } = req.body;
    try {
        let user = yield Users_1.default.findOne({ uid });
        if (!user) {
            user = new Users_1.default({ uid, email, displayName, photoURL, channelName });
            yield user.save();
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error saving user:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ success: false, message: "Error saving user", error: error.message });
    }
});
exports.CreatUser = CreatUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    try {
        const user = yield Users_1.default.findOne({ uid });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user by ID:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserById = getUserById;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Users_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.getAllUsers = getAllUsers;
const subscribeChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    console.log('sub', _id);
    const uid = req.uid;
    if (!_id || !uid) {
        res.status(400).json({ message: 'Channel ID and User ID are required' });
        return;
    }
    try {
        const channel = yield Channel_1.default.findOne({ _id });
        const user = yield Users_1.default.findOne({ uid });
        if (!channel) {
            res.status(404).json({ message: 'Channel not found' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isSubscribed = channel.subscribers.includes(uid);
        if (isSubscribed) {
            channel.subscribers = channel.subscribers.filter(subscriberId => subscriberId !== uid);
            channel.totalSubscribers -= 1;
            yield channel.save();
            res.status(200).json({
                message: 'Unsubscribed successfully',
                subscribers: channel.subscribers.length,
                totalSubscribers: channel.subscribers,
            });
        }
        else {
            channel.subscribers.push(uid);
            channel.totalSubscribers += 1;
            yield channel.save();
            res.status(200).json({
                message: 'Subscription successful',
                subscribersCount: channel.subscribers.length,
                subscribers: channel.subscribers
            });
        }
    }
    catch (error) {
        console.error('Error in subscription/unsubscription:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
exports.subscribeChannel = subscribeChannel;
const getSubscribersCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { channelId } = req.body;
    if (!channelId) {
        res.status(400).json({ message: 'Channel ID is required' });
        return;
    }
    try {
        const channel = yield Channel_1.default.findOne({ _id: channelId }).select('subscribers');
        if (!channel) {
            res.status(404).json({ message: 'Channel not found' });
            return;
        }
        res.status(200).json({
            totalSubscribers: channel.subscribers,
            subscribersCount: channel.subscribers.length
        });
    }
    catch (error) {
        console.error('Error fetching subscribers count:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});
exports.getSubscribersCount = getSubscribersCount;
