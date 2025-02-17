import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// post Route
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "social_app" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      user: req.user.id,
      content: req.body.content,
      image: imageUrl
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
// Get all posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["username"]);
    res.json(posts);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Like a post
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift(req.user.id);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Add comment
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { text } = req.body;

    const newComment = {
      user: req.user.id,
      text,
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;
