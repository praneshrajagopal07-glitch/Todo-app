import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('todo_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    localStorage.setItem('todo_user', JSON.stringify(data));
    return data;
  };

  const register = async (credentials) => {
    const data = await authService.register(credentials);
    setUser(data);
    localStorage.setItem('todo_user', JSON.stringify(data));
    return data;
  };

  const googleLogin = async (idToken) => {
    const data = await authService.firebaseLogin(idToken);
    setUser(data);
    localStorage.setItem('todo_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('todo_user');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('todo_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
