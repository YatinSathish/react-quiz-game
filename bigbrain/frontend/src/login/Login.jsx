import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },   
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
    } catch (err) {
      console.log("Login error:", err.message);      
      toast.error(err.message || 'Login failed');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Welcome to Big Brain!</h1>
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm text-center mt-4">
          New here?{' '}
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}
