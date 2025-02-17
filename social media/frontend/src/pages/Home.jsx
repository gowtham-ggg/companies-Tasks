import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import Login from './Login';

export default function Home() {
  const { user } = useAuth();
  const { posts, setSortBy } = usePosts();

  return user ? (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Feed</h1>
        <select 
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
      
      <CreatePost />
      
      {posts.map(post => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  ) : (
    <Login />
  );
}
