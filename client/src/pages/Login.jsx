import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate } from "react-router-dom";
const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const {loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email)
    data.append("password", password)
    dispatch(login(data))
  }

  useEffect(() => {
    // if (message) {
    //   toast.success(message);
    //   dispatch(resetAuthSlice());
    // }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }


  return <>


  <div className="flex flex-col justify-center md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative ">

          <div className="max-w-sm w-full">
            <div className="flex justify-center mb-12 ">
              {" "}
              <div className="rounded-full flex items-center justify-center">
                <img src={logo} alt="logo" className="h-24 w-auto" />
              </div>
            </div>
            <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden ">
              Welcome Back !!
            </h1>
            <p> Please enter your credentials to log in </p>
            <form onSubmit={handleLogin}>

              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md  focus:outline-none"
                />
              </div>

<div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md  focus:outline-none"
                />
              </div>
              <Link to={"/password/forgot"} className="font-semibold text-black mb-12" >Forgot Password?</Link>
              <div>
                <p>New to our platform? <Link to={"/register"}>Sign Up</Link> </p>
              </div>


              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition "
              >
                SIGN IN
              </button>
            </form>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div>
          <div>
            <div>
              <img src={logo_with_title} alt="logo" />
            </div>
            <p>New to our Platform? Sign up now.</p>
            <Link
              to={"/register"}
              className="border-2 mt-5 border-white px-8 w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>


  </>;
};

export default Login;
