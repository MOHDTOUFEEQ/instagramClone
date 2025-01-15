import React, { useEffect, useState } from 'react'
import { login as authlogin } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import {  Link, useNavigate } from 'react-router-dom'
import authService from '../appwrite/auth';
import { successfully } from '../store/authSlice';
const Loading = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      <span className="ml-2 text-gray-900">Creating Account...</span>
    </div>
  );
function Signup() {

    const navigate = useNavigate()
    const[error,setError] = useState()
    const [successMessage, setSuccessMessage] = useState(null);
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit} = useForm()
    
    const signingup = async (data) => {
        try {
          setLoading(true);
          console.log(data);
      
          if (data.confirm_password !== data.password) {
            console.log("log1");
            throw new Error("Password do not match");
          }
      
          console.log("log1_1");
      
          const session = await authService.storingUserInfo({
            email: data.email,
            password: data.confirm_password,
            name: data.name,
          });
      
          console.log("this is seion", session);
          console.log("log2");
      
          if (session) {
            const profile = await authService.createPostProfile(session.$id, {
              userID: session.$id,
              userName: session.name,
            });
            if (profile) {
              setSuccessMessage('Your account has been successfully created. Redirecting to login in 4 seconds...');
          
              let countdown = 5;
              const intervalId = setInterval(() => {
                setSuccessMessage(`Redirecting to login in ${countdown} seconds...`);
                countdown--;
    
                if (countdown === 0) {
                  clearInterval(intervalId);
                  navigate('/login'); // Redirect to login page after 4 seconds
                }
              }, 1000);
            }
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false); // Set loading to false when the signup process is complete (success or failure)
        }
      };
      
    return (
    <>
    
    <section>
        <div class="flex-">
            <div class="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div class="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Sign up
                </h2>
                <p class="mt-2 text-base text-gray-600">
                Already have an account?{" "}
                <Link
                    to={"/login"}
                    class="font-medium text-black transition-all duration-200 hover:underline"
                >
                    Sign In
                </Link>
      
                </p>
                <form onSubmit={handleSubmit(signingup)} class="mt-8">
                <div class="space-y-5">
                    <div>
                    <label for="name" class="text-base font-medium text-gray-900">
                        {" "}
                        Full Name{" "}
                       
                    </label>
                    <div class="mt-2">
                        <input
                        class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Full Name"
                        id="name"
                        {...register("name",{
                            required:true,
                        })}
                        />
                    </div>
                    </div>
                    <div>
                    <label for="email" class="text-base font-medium text-gray-900">
                        {" "}
                        Email address{" "}
                    </label>
                    <div class="mt-2">
                        <input
                        class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="email"
                        placeholder="Email"
                        id="email"
                        {...register('email', {
                            required: 'This field is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address',
                        }})}
                        />
                    </div>
                    </div>
                    <div>
                    <div class="flex items-center justify-between">
                        <label
                        for="password"
                        class="text-base font-medium text-gray-900"
                        >
                        {" "}
                        Password{" "}
                        
                        </label>
                    </div>
                    <div class="mt-2">
                        <input
                        class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="password"
                        placeholder="Password"
                        id="password"
                        {...register("password",{
                            required:true,
                        })}
                        />
                    </div>
                    <div class="flex items-center justify-between">
                        <label
                        for="password_confirm"
                        class="text-base font-medium text-gray-900"
                        >
                        {" "}
                        confirm password{" "}
                        
                        </label>
                    </div>
                    <div class="mt-2">
                        <input
                        class="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="password"
                        placeholder="confirm password"
                        id="confirm_password"
                        {...register("confirm_password",{
                            required:true,
                        })}
                        />
                    </div>
                    </div>
                    <div>
                    {loading ? <Loading /> : 
                    <button
                        type="submit"
                        class="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 "
                    >
                        Create Account{" "}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="ml-2"
                        >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>}
                    </div>
                </div>
                </form>
                <div class="mt-3 space-y-3">
                    {error ? <p>{error}</p> : null}
                    {successMessage ? <p className="text-green-500">{successMessage}</p> : null}
                </div>
            </div>

            </div>
        </div>
    </section>

    </>
  )
}

export default Signup
