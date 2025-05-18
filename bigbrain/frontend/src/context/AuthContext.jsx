// context/AuthContext.jsx
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../login/login_register_calls';



export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('user');
    const userData = {email : email}
    console.log("saved user",userData)
    return email ? userData : null;
  });
  
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      const userData = {email : email}
      const token = res.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', email)
      setUser(userData);
      console.log('login user',user)
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err)
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    try {
      const res = await registerUser(name, email, password);
      //hideLoading()
      const userData = res.data.user;
      const token = res.data.token;

      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

