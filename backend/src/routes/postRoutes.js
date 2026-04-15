import express from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);

router.get("/", postController.getPosts);

router.get("/my", authMiddleware, postController.getMyPosts);

router.delete("/:id", authMiddleware, postController.deletePost);

export default router;