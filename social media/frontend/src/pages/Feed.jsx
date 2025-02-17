import { usePosts } from '../context/PostContext';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

const Feed = () => {
  const { posts, setSortBy } = usePosts();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <CreatePost />
      
      <div className="mb-4">
        <select 
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;