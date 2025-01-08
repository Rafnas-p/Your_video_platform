
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadVideo } from "../Cloudnary/config";
import Video from "../models/Video";
import Shorts from "../models/Shorts";
import { CustomRequest } from "../middelware/authMiddelware";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/videos");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
export const videoUpload = upload.single("video");

export const uploadVideoToCloudinary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No video file uploaded" });
      return;
    }

    const { description, userId, title, category ,profil,userName ,channelId} = req.body;

    if (!userId || !description) {
      res
        .status(400)
        .json({ message: "Missing required fields: userId or description" });
      return;
    }

    const filePath = req.file.path;

    const result = await uploadVideo(filePath);
    
    fs.unlinkSync(filePath);

    let video;
    if (result.duration > 45) {
      video = new Video({
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
      await video.save(); 
    } else {
      video = new Shorts({
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
      await video.save(); 
    }

    res.status(200).json({
      message: "Video uploaded and saved successfully",
      data: video,
    });
  } catch (error: any) {
    console.error("Error uploading video:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};




export const likeVideo = async (req:CustomRequest , res: Response) => {
  const { channelId } = req.body;
const userId=req.user


  if (!channelId || !userId) {
    res.status(400).json({ message: "User ID and Video ID are required" });
    return;
  }

  try {
    const video = await Video.findById(channelId);

    if (!video) {
      res.status(404).json({ message: "Video not found" });
      return;
    }

    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((userId) => userId !== userId);
      
      video.dislikes = video.dislikes.filter((userId) => userId !== userId);

      await video.save();

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
    await video.save();

    res.status(200).json({
      message: "Video liked successfully",
      likesCount: video.likes.length,
      dislikesCount: video.dislikes.length,
      likes: video.likes,
      dislikes: video.dislikes
    });

  } catch (error: any) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
 export const videolikeCount =async(req: Request, res: Response)=>{
  const {_id}=req.body
  if (!_id ) {
    res.status(400).json({ message: " Video ID are required" });
    return;
  }

    try {
          const video = await Video.findById(_id);
          if (!video) {
            res.status(404).json({ message: "Video not found" });
            return;
          }
      
      res.status(200).json({
        likesCount: video.likes.length,
        likes: video.likes,
      });
    } catch (error:any) {
      
    
    

  }
 }

export const dislikeVideo = async (req:CustomRequest, res: Response) => {
  const { channelId  } = req.body;
  const userId=req.user

  
  if (!channelId || !userId) {
    res.status(400).json({ message: "User ID and Video ID are required" });
    return;
  }

  try {
    const video = await Video.findById(channelId);

    if (!video) {
      res.status(404).json({ message: "Video not found" });
      return;
    }

    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((uId) => uId !== userId);
      await video.save();

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

    await video.save();

    res.status(200).json({
      message: "Video disliked successfully",
      dislikesCount: video.likes.length,
      dislikes: video.likes.length,
      dislikarray:video.dislikes
    });

  } catch (error: any) {
    console.error("Error toggling dislike:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
