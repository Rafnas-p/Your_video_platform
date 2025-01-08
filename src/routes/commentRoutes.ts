import express from 'express';
import {addComment, deleteComment,getCommentsById} from "../controllers/commentController"
import authMiddleware from '../middelware/authMiddelware';

const router = express.Router();

router.post("/addComment/:videoId",authMiddleware,addComment)
router.delete("/deleteComment/:id",deleteComment)
router.get("/getCommentsById/:videoId", getCommentsById);
export default router