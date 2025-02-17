import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useState } from 'react';
import CommentSection from './CommentSection';

export default function Post({ post, setPosts }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.some(like => like.user === user?.id));
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BACKEND_URL}/api/posts/like/${post._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPosts(prev =>
        prev.map(p => 
          p._id === post._id ? { ...p, likes: res.data.likes } : p
        )
      );
      setLiked(!liked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 max-w-2xl mx-auto">
    <div className="flex items-center mb-2">
      <img 
        src={post.user.profilePic || '/default-avatar.png'} 
        className="w-10 h-10 rounded-full mr-2 object-cover"
        alt={post.user.username}
      />
      <div>
        <h3 className="font-bold text-gray-800">{post.user.username}</h3>
        <p className="text-gray-500 text-sm">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <p className="mb-2 text-gray-800">{post.content}</p>
    {post.image && (
      <img 
        src={post.image} 
        alt="Post" 
        className="w-full rounded-lg mb-2 object-cover max-h-96" 
      />
    )}
    <div className="flex gap-6 text-gray-600 border-t pt-2">
      <button 
        onClick={handleLike}
        className={`flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100 ${
          liked ? 'text-blue-600 font-semibold' : ''
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 8.437C2 5.505 4.294 3.094 7.207 3 9.243 3 11.092 4.19 12 6c.823-1.758 2.649-3 4.651-3C19.545 3 22 5.507 22 8.432 22 16.24 13.646 20 12 20 10.295 20 2 16.24 2 8.437z"/>
        </svg>
        {post.likes.length}
      </button>
      <button 
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {post.comments.length}
      </button>
    </div>
    {showComments && <CommentSection postId={post._id} comments={post.comments} />}
  </div>
);
}
