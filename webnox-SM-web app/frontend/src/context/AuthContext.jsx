import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = async (newToken) => {
    if (!newToken) return;
  
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUser({ ...data.userData, token: newToken });  
    } catch (error) {
      console.error('Error fetching user:', error.response?.data?.message);
      logout();
    }
  };
  

  useEffect(() => {
    fetchUser(token);
  }, [token]);

  const login = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await fetchUser(newToken);  
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
