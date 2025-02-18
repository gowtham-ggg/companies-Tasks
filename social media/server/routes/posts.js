// postRoutes.js
import express from "express";
import Post from "../models/post.js";
import upload from "../middleware/multer.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// GET all posts => GET /api/posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "profilePic username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// CREATE a new post => POST /api/posts
router.post(
  "/",
  authMiddleware, // enable authMiddleware so req.user is available
  upload.single("image"),
  async (req, res) => {
    try {
      let imageUrl = "";

      // If there's a file, upload to Cloudinary
      if (req.file) {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "social_media_app/posts" },
          (error, result) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ message: "Error uploading image" });
            }

            imageUrl = result.secure_url;
            createAndSendPost();
          }
        );
        uploadStream.end(req.file.buffer);
      } else {
        createAndSendPost();
      }

     // postRoutes.js (backend)
async function createAndSendPost() {
  const newPost = new Post({
    content: req.body.content,
    image: imageUrl,
    user: req.user.id,
  });

  await newPost.save();
  // Populate user data before sending response
  const populatedPost = await Post.findById(newPost._id).populate('user', 'profilePic username');
  return res.status(201).json(populatedPost);
}
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating post" });
    }
  }
);


// LIKE a post => PUT /api/posts/like/:id
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.likes.some((like) => like.toString() === req.user.id)) {
      post.likes = post.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD comment => POST /api/posts/comment/:postId
router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ text, user: req.user.id });
    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
