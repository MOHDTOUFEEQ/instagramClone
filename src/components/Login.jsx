import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import { useForm } from 'react-hook-form';

const Loading = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
    <span className="ml-2 text-gray-900">Logging In...</span>
  </div>
);

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      setLoading(true);
      const session = await authService.login(data); // Send email & password for login
      if (session) {
        const userData = await authService.getCurrentUser(); // Fetch user data
        if (userData) dispatch(authLogin({ userData })); // Store user data in Redux
        setLoading(false);
        navigate('/'); // Navigate to the homepage after successful login
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="main-container h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <svg
            width="50"
            height="56"
            viewBox="0 0 50 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528Z"
              fill="black"
            ></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Don’t have an account?{' '}
          <Link to="/Sign-up" className="font-medium text-blue-600 hover:underline">
            Create a free account
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              className={`block w-full mt-1 p-2 border rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className={`block w-full mt-1 p-2 border rounded ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            {loading ? (
              <Loading />
            ) : (
              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
              >
                Login
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-center text-sm">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;
