import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState("sign up");
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = state === "sign up" ? 'register' : 'login';
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/${endpoint}`,
        state === "sign up" ? formData : { email: formData.email, password: formData.password }
      );

      if (data.token) {
        login(data.token);
        toast.success(`Welcome ${state === 'sign up' ? formData.username : 'back'}!`);
        navigate('/feed');
      } else {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {state === "sign up" ? "Create Account" : "Welcome Back"}
        </h2>
        
        {state === "sign up" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {state === "sign up" ? "Register" : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          {state === "sign up"
            ? "Already have an account? "
            : "Need an account? "}
          <button
            type="button"
            onClick={() => setState(state === "sign up" ? "login" : "sign up")}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            {state === "sign up" ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </form>
  );
};

export default Login;