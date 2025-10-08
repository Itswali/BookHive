import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import AddNewAdmin  from "../popups/AddNewAdmin"
import SettingPopup from "../popups/SettingPopup";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const {addNewAdminPopup, settingPopup} = useSelector(state => state.popup);
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bg-black text-white h-screen w-64 z-20 transform ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex justify-center p-6">
          <img src={logo_with_title} alt="Logo" className="h-28 w-auto" />
        </div>
        <nav className="flex flex-col space-y-3 px-6 py-4">
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" />
            <span>Dashboard</span>
          </button>
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" />
            <span>Books</span>
          </button>

          {/* CATALOG BUTTON MOVED HERE - Visible to ALL authenticated users */}
          {isAuthenticated && user?.role === "User" &&  (
            <button
              className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
              onClick={() => setSelectedComponent("Catalog")}
            >
              <img src={catalogIcon} alt="icon" />
              <span>Catalog</span>
            </button>
          )}

          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" />
                <span>Users</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="h-6 w-6" />
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "User" && (
            <>
              {/* The original Catalog button was here and is now removed. */}

              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("My Favorites")}
              >
                <img src={catalogIcon} alt="icon" /> {/* Using catalog icon, recommend heart icon asset */}
                <span>My Favorites</span>
              </button>
              <button
                className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
                onClick={() => setSelectedComponent("My Borrowed Books")}
              >
                <img src={catalogIcon} alt="icon" />
                <span>My Borrowed Books</span>
              </button>
            </>
          )}
          <button
            className="w-full py-2 font-medium bg-transparent rounded-md hover:cursor-pointer flex items-center space-x-2"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" />
            <span>Update Credentials</span>
          </button>
        </nav>
        <div className="px-6 py-4">
        <button className="py-2 font-medium text-center bg-transparent rounded-md hover:cursor-pointer flex items-center justify-center space-x-5 mx-auto w-fit" onClick={handleLogout} >
          {" "}
          <img src={logoutIcon} alt="icon" /> <span>Logout</span>{" "}
        </button>
        </div>
        <img src={closeIcon} alt="icon" onClick={() => setIsSideBarOpen(!isSideBarOpen)} className="h-fit w-fit absolute top-0 right-4 mt-4 block md:hidden" />
      </aside>
      {addNewAdminPopup && <AddNewAdmin /> }
      {settingPopup && <SettingPopup /> }
    </>
  );
};

export default SideBar;
