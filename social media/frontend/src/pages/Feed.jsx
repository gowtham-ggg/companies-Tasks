import { usePosts } from '../context/PostContext';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { useEffect } from 'react';

const Feed = () => {
  const { posts, setSortBy, fetchPosts } = usePosts();

  useEffect(() => {
    fetchPosts(); // Fetch posts only once when the component mounts
  }, [posts]); // Empty dependency array

  return (
    <div className="max-w-2xl mx-auto p-4">
      <CreatePost />

      <div className="mb-4">
        <select 
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
