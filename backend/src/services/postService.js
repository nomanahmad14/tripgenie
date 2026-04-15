import Post from "../models/postModel.js";

const createPost = async (data, userId, file) => {
  if (!file) {
    throw new Error("Image is required");
  }

  const { caption, location, category } = data;

  const formattedLocation = {
    name: location.name.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
    country: location.country.trim()
  };

  const post = await Post.create({
    user: userId,
    image: file.path,
    caption,
    location: formattedLocation,
    category
  });

  return post;
};

const getPosts = async (query) => {
  const { page = 1, limit = 10, location } = query;

  const filter = {};

  if (location) {
    filter["location.name"] = {
      $regex: location,
      $options: "i"
    };
  }

  const skip = (page - 1) * limit;

  const posts = await Post.find(filter)
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Post.countDocuments(filter);

  return {
    posts,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit)
  };
};

const getMyPosts = async (userId) => {
  const posts = await Post.find({ user: userId })
    .sort({ createdAt: -1 });

  return posts;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findOneAndDelete({
    _id: postId,
    user: userId
  });

  if (!post) {
    throw new Error("Post not found or unauthorized");
  }

  return;
};
export default { createPost,getPosts,getMyPosts,deletePost };