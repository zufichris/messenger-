import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";

import { server } from "../server";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { logUser } from "../slices/userSlice";
const Auth = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (user?.email) {
      navigate("/chats");
    }
  }, []);
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [showpass, setShopass] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    setLoading(true);
    setError(false);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (show) {
      await axios
        .post(`${server}/api/users/login`, {
          email,
          password,
        })
        .then((res) => {
          setLoading(false);
          if (res?.data?.token) {
            window.localStorage.setItem("token", JSON.stringify(res.data));
            dispatch(logUser(res.data.user));
            navigate("/chats");
          } else {
            setErrMessage(res?.data?.error);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err?.response?.data) {
            setErrMessage(err?.response?.data?.error);
          } else {
            setErrMessage("An error occured");
          }

          setLoading(false);
          setError(true);
        });
    } else {
      await axios
        .post(`${server}/api/users/`, formData)
        .then((res) => {
          if (res.data.token) {
            window.localStorage.setItem("token", JSON.stringify(res.data));
            dispatch(logUser(res.data.user));
            navigate("/chats");
            return;
          } else {
            setError(true);
            setErrMessage(res?.data?.error);
          }
          setLoading(false);
        })
        .catch((err) => {
          if (err.response.data) {
            setErrMessage(err.response.data.error);
          } else {
            setErrMessage("An error occured");
          }

          setLoading(false);
          setError(true);
        });
    }
  };
  return (
    <div className="w-full h-screen overflow-y-scroll bg-gray-300 sm:pt-16 sm:px-10 pt-24 px-5">
      <div className="m-auto text-center  w-full p-4 mb-4 bg-white   sm:w-1/3    rounded-t-md shadow-sm shadow-black text-xl styledtext font-black text-green-600">
        Welxome to PiChat!
      </div>
      <div className="m-auto w-full p-4 bg-white   sm:w-1/3    rounded-b-md shadow-md shadow-black">
        <div className="w-full flex relative">
          <button
            onClick={() => setShow(true)}
            style={{ transition: "0.2s all ease-in-out" }}
            className={`${
              show
                ? "bg-green-200 text-gray-600 scale-110"
                : "text-gray-800 animate-pulse"
            } w-1/2 rounded-full  font-bold py-1 text-sm `}
          >
            Login
          </button>
          <button
            onClick={() => setShow(false)}
            style={{ transition: "0.2s all ease-in-out" }}
            className={`${
              !show
                ? "bg-green-200 text-gray-600 scale-110 "
                : "text-gray-800 animate-pulse"
            } font-bold w-1/2 rounded-full  py-1 text-sm`}
          >
            Sign Up
          </button>
        </div>
        <p
          className={`${
            !error ? "hidden" : ""
          } text-red-600 w-full text-center p-1 m-1 font-light text-sm`}
        >
          {errMessage}
        </p>
        <form
          onSubmit={(e) => submit(e)}
          style={{ transition: "0.2s all ease-in-out" }}
          className="w-full my-5 flex flex-col  items-center justify-between gap-3"
          encType="multipart/form-data"
        >
          {!show && (
            <>
              <input
                style={{ transition: "0.2s all ease-in-out" }}
                type="text"
                name="name"
                placeholder="Username"
                className="pl-2 focus:border-2 focus:bg-white focus:border-green-600 bg-green-50 my-2 w-full rounded-md placeholder:text-green-600 placeholder:font-light"
                required
              />
              <input
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="image/*"
                type="file"
                name="avatar"
                className="hidden avatar"
              />
            </>
          )}
          <input
            style={{ transition: "0.2s all ease-in-out" }}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Email"
            className="pl-2 focus:border-2 focus:bg-white focus:border-green-600 bg-green-50 my-2 w-full rounded-md placeholder:text-green-600 placeholder:font-light"
            required
          />

          <input
            style={{ transition: "0.2s all ease-in-out" }}
            type={showpass ? "text" : "password"}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="pl-2 focus:border-2 focus:bg-white focus:border-green-600 bg-green-50 my-2 w-full rounded-md placeholder:text-green-600 placeholder:font-light"
            required
          />
          <div className="w-full text-left text-xs">
            show password{" "}
            <input
              onChange={() => {
                setShopass((c) => !c);
              }}
              type="checkbox"
            />
          </div>
          {!show && (
            <div
              onClick={() => document.querySelector(".avatar").click()}
              className="w-full text-xs font-light text-center flex cursor-pointer  items-center justify-center flex-col gap-1"
            >
              <p> profile photo</p>
              {avatar ? (
                <img
                  src={avatar && URL.createObjectURL(avatar)}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <RxAvatar size={"1.5rem"} />
              )}
            </div>
          )}
          {!show ? (
            <button
              disabled={loading ? true : false}
              style={{ transition: "0.2s all ease-in-out" }}
              type="submit"
              className="bg-green-600 flex disabled:bg-opacity-70 items-center justify-center py-1 text-white font-semibold  w-1/2 rounded-full"
            >
              {loading ? (
                <MoonLoader color="white" size={20} loading={loading} />
              ) : (
                "Sign up"
              )}
            </button>
          ) : (
            <button
              disabled={loading ? true : false}
              style={{ transition: "0.2s all ease-in-out" }}
              type="submit"
              className="bg-green-600 flex disabled:bg-opacity-70 items-center justify-center py-1 text-white font-semibold  w-1/2 rounded-full"
            >
              {loading ? (
                <MoonLoader color="white" size={20} loading={loading} />
              ) : (
                "Login"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
