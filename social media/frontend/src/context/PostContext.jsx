import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Use Vite's environment variable format
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/posts`);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Add new post
  const addPost = async (newPost) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BACKEND_URL}/api/posts`, newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts([res.data, ...posts]);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  // Like/Unlike a post
  const toggleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${BACKEND_URL}/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.map((post) =>
        post._id === postId
          ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
          : post
      ));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  // Add a comment
  const addComment = async (postId, comment) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BACKEND_URL}/api/posts/comment/${postId}`, { text: comment }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(posts.map((post) =>
        post._id === postId ? { ...post, comments: res.data } : post
      ));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Sort posts dynamically
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "popular") {
      return b.likes + b.comments.length - (a.likes + a.comments.length);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ 
      posts: sortedPosts, 
      addPost, 
      toggleLike, 
      addComment, 
      setSortBy 
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => useContext(PostContext);
