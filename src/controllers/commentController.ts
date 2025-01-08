import { Request, Response } from "express";
import Comments from "../models/Comment";
import mongoose from "mongoose";
import { CustomRequest } from "../middelware/authMiddelware";

export const addComment = async (req:CustomRequest, res: Response) => {
  const { videoId } = req.params;
  const {  userName, userProfile, text } = req.body;
  const userId=req.user
console.log('userId',userId);

  if (!text || !userId || !userName) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }
  
  try {
    const newComment = new Comments({
      videoId,
      userId,
      userName,
      userProfile,
      text,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error });
  }
};


export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid comment ID" });
    return;
  }

  try {
    const deletedComment = await Comments.findByIdAndDelete(id);

    if (!deletedComment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const getCommentsById = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  try {
    const comments = await Comments.find({ videoId });

    if (!comments || comments.length === 0) {
      res.json(comments || []);   
         return;
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "An error occurred while fetching comments." });
  }
};
