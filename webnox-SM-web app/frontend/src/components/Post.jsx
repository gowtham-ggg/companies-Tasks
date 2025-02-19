import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostContext'
import axios from 'axios'
import CommentSection from './CommentSection'

const Post = ({ post }) => {
  const { user } = useAuth()
  const { setPosts } = usePosts()
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id))
  const [showComments, setShowComments] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

// components/Post.jsx
const handleLike = async () => {
  try {
    const token = localStorage.getItem("token");
    const { data: updatedLikes } = await axios.put(
      `${backendUrl}/api/posts/like/${post._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setPosts((prev) =>
      prev.map((p) =>
        p._id === post._id ? { ...p, likes: updatedLikes } : p
      )
    );
    setIsLiked(updatedLikes.includes(user?._id)); // Update based on actual backend response
  } catch (error) {
    toast.error("Failed to update like");
  }
};


  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex items-center mb-4">
  <img 
    src={post.user?.profilePic || '/default-avatar.jpeg'} 
    className="w-10 h-10 rounded-full mr-3"
    alt={post.user?.username || 'Unknown User'}
  />
  <div>
    <h3 className="font-semibold text-gray-900">
      {post.user?.username || "Unknown User"}
    </h3>
    <p className="text-sm text-gray-500">
      {new Date(post.createdAt).toLocaleDateString()}
    </p>
  </div>
</div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex items-center gap-4 text-gray-600 border-t pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 ${isLiked ? 'text-blue-600' : ''}`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {post.likes.length}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {post.comments.length}
        </button>
      </div>

      {showComments && <CommentSection postId={post._id} comments={post.comments} />}
    </div>
  )
}

export default Post