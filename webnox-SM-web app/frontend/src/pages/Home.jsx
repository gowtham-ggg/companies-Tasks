import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import Login from './Login';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      navigate('/feed');
    }
  }, [user, navigate]);

 

  return user ? (
    <div className="flex flex-col items-center mt-10 p-4">
      <h1 className="text-4xl font-bold text-blue-700">Welcome to SocialBook</h1>
      <p className="mt-2 text-lg text-gray-700">
        Connect with friends, share moments, and explore new stories.
      </p>
      <div className="mt-6 w-full max-w-lg">
        <CreatePost />
      </div>
    </div>
  ): (
    <Login />
  )
}
