import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    image: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true
    },
    location: {
      name: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    category: {
      type: String,
      enum: ["nature", "cafe", "club", "adventure", "food"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;