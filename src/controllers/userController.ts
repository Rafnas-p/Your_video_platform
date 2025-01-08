import { Request, Response } from "express";
import User from "../models/Users"
import Channel from "../models/Channel";
import { CustomRequest } from "../middelware/authMiddelware";

export const CreatUser = async (req:Request, res:Response) => {

  const { uid, email, displayName, photoURL, channelName } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email, displayName, photoURL, channelName });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error:any) {
    console.error("Error saving user:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ success: false, message: "Error saving user", error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({uid});

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
    
    export const getAllUsers = async (req: Request, res: Response) => {
      try {
        const users = await User.find(); 
        res.status(200).json(users); 
      } catch (error: any) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ error: "Failed to fetch users" });
      }
    };

   
    export const subscribeChannel = async (req: CustomRequest, res: Response) => {
      const {_id } = req.body;
    console.log('sub',_id);
    
    
      const uid=req.uid

      if (!_id || !uid) {
        res.status(400).json({ message: 'Channel ID and User ID are required' });
        return;
      }
    
      try {
        const channel = await Channel.findOne({ _id });
        const user = await User.findOne({ uid });
    
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
          await channel.save();
    
          res.status(200).json({
            message: 'Unsubscribed successfully',
            subscribers: channel.subscribers.length,
            totalSubscribers: channel.subscribers,
          });
        } else {
          channel.subscribers.push(uid);
          channel.totalSubscribers += 1;
          await channel.save();
    
          res.status(200).json({
            message: 'Subscription successful',
            subscribersCount: channel.subscribers.length,
            subscribers:channel.subscribers
          });
        }
    
      } catch (error: any) {
        console.error('Error in subscription/unsubscription:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    };
    
   
    export const getSubscribersCount = async (req: Request, res: Response) => {
      const { channelId } = req.body;
    
      if (!channelId) {
        res.status(400).json({ message: 'Channel ID is required' });
        return;
      }
    
      try {
        const channel = await Channel.findOne({ _id: channelId }).select('subscribers');
    
        if (!channel) {
          res.status(404).json({ message: 'Channel not found' });
          return;
        }
    
        res.status(200).json({
          totalSubscribers: channel.subscribers,
          subscribersCount: channel.subscribers.length
        });
        
      } catch (error: any) {
        console.error('Error fetching subscribers count:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    };
    