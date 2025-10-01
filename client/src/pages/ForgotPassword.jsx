import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div>
        {/*LEFT SIDE  */}
        <div>
          <div>
            <div>
              <img src={logo_with_title} alt="logo" />
            </div>
            <h3>"Your premier digital library for reading books."</h3>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div>
          <Link
            to={"/login"}
            className="border-2 border-black rounded-3x1 font-bold w-52 py-2 px-4 fixed top-10 -left-28 hover:bg-black hover:text-white transition duration-300 text-end"
          >
            Back
          </Link>
          <div>
            <div>
              <div>
                <img src={logo} alt="logo" />
              </div>
            </div>
            <h1>Forgot Password</h1>
            <p>Please enter your email</p>
            <form onSubmit={handleForgotPassword}>
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-black rounded-md  focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition "
                disabled={loading ? true : false}
              >
                RESET PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
