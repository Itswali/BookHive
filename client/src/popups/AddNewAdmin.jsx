import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import {addNewAdmin} from "../store/slices/userSlice"
import {toggleAddNewAdminPopup} from "../store/slices/popUpSlice"

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);


  const handleImageChange = (e)=>{};

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("avatar", avatar)
    dispatch(addNewAdmin(formData))
  }

  return <>
  <h1 className="fixed insert-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
    <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
    <div className="p-6">
      <header>
        <div>
          <img src={keyIcon} alt="key-icon" />
          <h3>Add New Admin</h3>
        </div>
        <img src={closeIcon} alt="close-icon" onClick={()=> dispatch(toggleAddNewAdminPopup())} />
      </header>
    </div>
    </div>
  </h1>

  </>;
};

export default AddNewAdmin;
