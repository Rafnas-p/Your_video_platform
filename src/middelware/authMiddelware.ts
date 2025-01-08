import { Request, Response, NextFunction } from "express";
import admin from "../../firebase/firebaseAdmin"
import User from "../models/Users"; 

 export interface CustomRequest extends Request {
  uid?:string|any
  user?: string | any; 
}

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const mongoDbId = req.headers["x-mongodb-id"];


    if (!authHeader || !mongoDbId) {
      res.status(401).json({ message: "Unauthorized: Missing token or MongoDB ID" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findById(mongoDbId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.uid !== decodedToken.uid) {
      res.status(403).json({ message: "Unauthorized: User mismatch" });
      return;
    }

    req.user = user._id.toString()
    req.uid=user.uid
 
    next(); 
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
