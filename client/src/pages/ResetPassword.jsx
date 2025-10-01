import React, { useEffect, useState } from "react";
import { data, Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");

  const { token } = useParams();

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formData, token));
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
        {/* LEFT SECTION */}
        <div>
          <div>
            <div>
              <img src={logo_with_title} alt="logo" />
            </div>
            <h3>"Your premier digital library for reading books."</h3>
          </div>
        </div>

        {/* RIGHT SECTION */}

        <div>
          <Link
            to={"/password/forgot"}
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
            <h1>Reset Password</h1>
            <p>Please enter your new password</p>
            <form onSubmit={handleResetPassword}>
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-black rounded-md  focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfrimPassword(e.target.value)}
                  placeholder="Confirm Password"
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

export default ResetPassword;
