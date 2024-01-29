import axios from "axios";
import React, { useState } from "react";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../api/axiosInstance";
import { server } from "../server";
import { background } from "../slices/userSlice";
const Settings = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [newBg, setNewBg] = useState(null);
  const oldBg =
    user.background ===
    "http://127.0.0.1:5000/media/whatsapp-bg-1701014623890.png"
      ? null
      : user.background.split("/media/")[1];
  return (
    <div className="w-full p-2 flex flex-col justify-center items-center gap-6">
      <h6 className="capitalize text-SM font-semibold text-green-600">
        change chat background
      </h6>
      <input
        onChange={async (e) => {
          setNewBg(e.target.files[0]);
          if (e.target.files[0]) {
            await axiosInstance
              .post(
                `${server}/api/users/change-background`,
                {
                  background: e.target.files[0],
                  oldBg,
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => {
                if (res?.data?.background) {
                  dispatch(background(res.data.background));
                }
              })
              .catch((err) => {});
          }
        }}
        type="file"
        className="hidden background"
      />
      {(newBg || user?.background) && (
        <img
          onClick={() => {
            document.querySelector(".background").click();
          }}
          src={user?.background}
          className="h-20 w-20 shadow-sm shadow-black"
        />
      )}
      <button
        onClick={() => {
          window.localStorage.removeItem("token");
          window.location.reload();
        }}
        className="flex justify-center items-center gap-1 text-white bg-red-600 rounded-md shadow-sm shadow-black px-2 py-1"
      >
        <BsFillArrowLeftSquareFill />
        Logout
      </button>
    </div>
  );
};

export default Settings;
