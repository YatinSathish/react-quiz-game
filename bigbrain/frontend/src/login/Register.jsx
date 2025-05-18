import { useForm } from 'react-hook-form';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const { register: registerUser } = useAuth();

  const { user } = useAuth();
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
    setError,
  } = useForm();

  const onSubmit = (data) => {
    const { name, email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    try {
      registerUser(name, email, password, confirmPassword);
    } catch (err) {
      setError('email', { type: 'manual', message: err.message });
      toast.error('Registration failed');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Welcome to Big Brain!</h1>
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

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
          className="w-full mb-2 p-2 border rounded"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 p-2 border rounded"
          {...register('confirmPassword', { required: 'Please confirm your password' })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>
        )}

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <button
            onClick={handleLoginRedirect}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
