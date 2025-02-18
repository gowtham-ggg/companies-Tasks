import { useState } from "react";
import axios from "axios";
import { usePosts } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { addPost } = usePosts();
  const { token } = useAuth();  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!token) {
      toast.error("Authentication error. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      const { data } = await axios.post(`${BACKEND_URL}/api/posts`, formData, 
        {
        headers: { Authorization: `Bearer ${token}` },  
      });

      addPost(data);
      setContent("");
      setImage(null);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded mb-2"
        rows="3"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Post
      </button>
    </form>
  );
};

export default CreatePost;
