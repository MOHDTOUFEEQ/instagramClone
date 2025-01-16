import  { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";

const Loading = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    <span className="ml-2 text-gray-900">Creating Account...</span>
  </div>
);

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const signingup = async (data) => {
    setError(null); // Clear previous errors
    try {
      setLoading(true);

      // Validate password confirmation
      if (data.password !== data.confirm_password) {
        throw new Error("Passwords do not match");
      }

      // Create user
      const session = await authService.storingUserInfo({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (session) {
        // Create user profile
        const profile = await authService.createPostProfile(session.$id, {
          userID: session.$id,
          userName: session.name,
        });

        if (profile) {
          setSuccessMessage("Account created successfully. Redirecting to login...");
          
          // Countdown redirect to login
          let countdown = 5;
          const intervalId = setInterval(() => {
            setSuccessMessage(`Redirecting to login in ${countdown} seconds...`);
            countdown--;

            if (countdown === 0) {
              clearInterval(intervalId);
              navigate("/login");
            }
          }, 1000);
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
          <p className="mt-2 text-base text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-black hover:underline">
              Sign In
            </Link>
          </p>

          <form onSubmit={handleSubmit(signingup)} className="mt-8">
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="text-base font-medium text-gray-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    className={`flex h-10 w-full rounded-md border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 ${
                      errors.name ? "focus:ring-red-500" : "focus:ring-gray-400"
                    }`}
                    {...register("name", { required: "Full Name is required" })}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-base font-medium text-gray-900">
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    aria-label="Email Address"
                    className={`flex h-10 w-full rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 ${
                      errors.email ? "focus:ring-red-500" : "focus:ring-gray-400"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email format",
                      },
                    })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="text-base font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    aria-label="Password"
                    className={`flex h-10 w-full rounded-md border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 ${
                      errors.password ? "focus:ring-red-500" : "focus:ring-gray-400"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="text-base font-medium text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    id="confirm_password"
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                    className={`flex h-10 w-full rounded-md border ${
                      errors.confirm_password ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 ${
                      errors.confirm_password ? "focus:ring-red-500" : "focus:ring-gray-400"
                    }`}
                    {...register("confirm_password", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirm_password && (
                    <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2.5 rounded-md hover:bg-black/80 font-semibold"
                  >
                    Create Account
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Error/Success Messages */}
          <div className="mt-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
