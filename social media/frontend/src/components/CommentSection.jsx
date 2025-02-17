import { useState } from 'react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const { addComment } = usePosts();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addComment(postId, {
      username: user.username,
      text: newComment,
      createdAt: new Date().toISOString()
    });
    setNewComment('');
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded"
        />
      </form>

      {comments.map((comment, index) => (
        <div key={index} className="flex items-start mb-2">
          <div className="bg-gray-100 p-2 rounded-lg">
            <span className="font-medium">{comment.username}</span>
            <p className="text-gray-800">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;