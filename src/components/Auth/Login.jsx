import React, { useState } from "react";
import LoginCarousel from "./LoginCarousel";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";


const Login = () => {
  return (
    <div className="w-full h-screen grid grid-cols-3">
      <LoginCarousel />
      <LoginForm />
    </div>
  );
};

export default Login;

const LoginForm = () => {

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

   const [showPassword, setShowPassword] = useState(false);
      // const navigate = useNavigate();
  
      const togglePasswordVisibility = () => {
          setShowPassword(!showPassword);
      };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const res = await axios.post(`${BASE_URL}/api/v1/auth/login`, credentials);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("accountType", JSON.stringify(res.data.user.accountType));
          navigate("/");
      } catch (err) {
          setError(err.response?.data?.message || "Invalid Credentials");
      }
  };


  return (
    <div className="h-full w-full col-span-1 flex flex-col justify-center items-start px-8 text-[#203d5d]">
      <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit}>
      {/* <form className="space-y-6 w-full max-w-sm"> */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
            required
            value={credentials.email}
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <span
              className="absolute top-1/2 -translate-y-1/2 text-xl right-0 pr-3 flex justify-center items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>
          <a href="#" className="text-right w-full inline-block text-sm text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#203d5d] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </div>

        {/* <div className="text-center text-sm">
          Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>Sign up</span>
        </div> */}
      </form>
    </div>
  );
};
