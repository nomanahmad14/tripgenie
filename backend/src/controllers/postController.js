import postService from "../services/postService.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(
    req.body,
    req.user.id,
    req.file
  );

  res.status(201).json({
    success: true,
    data: post
  });
});

const getPosts = asyncHandler(async (req, res) => {
  const data = await postService.getPosts(req.query);

  res.json({
    success: true,
    ...data
  });
});

const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getMyPosts(req.user.id);

  res.json({
    success: true,
    posts
  });
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.id, req.user.id);

  res.json({
    success: true,
    message: "Post deleted successfully"
  });
});

export default { createPost,getPosts ,getMyPosts,deletePost};
