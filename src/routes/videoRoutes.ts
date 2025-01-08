import express from "express";
import {
  videoUpload,
  uploadVideoToCloudinary,
  likeVideo,
  dislikeVideo,
  videolikeCount,
} from "../controllers/videoController";
import {
  getAllShorts,
  getAllVideos,
  getEntairVideos,
  getVideoById,
  getEntairShorts,
  UpdateVideoByID,
  UpdateShortsByID,
  getShortsById,
  createChannel,
  imageUpload,
  getChannels,
  getChannelsByName,
  deleteVideoById,
  deleteShortsById,
} from "../controllers/chanalController";
import {
  CreatUser,
  getAllUsers,
  getSubscribersCount,
  getUserById,
  subscribeChannel,
} from "../controllers/userController";
import authMiddleware from "../middelware/authMiddelware";
const router = express.Router();

router.post("/videos/upload", videoUpload, uploadVideoToCloudinary);
router.get("/videos", getAllVideos);
router.get("/shorts", getAllShorts);
router.get("/EntairVideos", getEntairVideos);
router.get("/entaireShorts", getEntairShorts);
router.get("/video/:videoId", getVideoById);

router.post("/users", CreatUser);
router.get("/getUserById/:uid", getUserById);
router.get("/getallusers", getAllUsers);
router.put("/updateVideoDetails/:videoId", UpdateVideoByID);
router.put("/updateShortsDetails/:shortsId", UpdateShortsByID);
router.get("/short/:shortsId", getShortsById);
router.post("/create-channel",authMiddleware, imageUpload, createChannel);
router.post("/subscribChannel",authMiddleware,subscribeChannel);
router.post("/getSubscribersCount", getSubscribersCount);
router.post("/likeVideo",authMiddleware, likeVideo);
router.post("/likeVideoCount",videolikeCount);

router.post("/dislikeVideo",authMiddleware, dislikeVideo);
router.get("/getchannel", getChannels);
router.get("/getChannelsByName", getChannelsByName);
router.delete("/deleatVideoById/:id",deleteVideoById)
router.delete("/deleteShortsById/:id",deleteShortsById)

export default router;
