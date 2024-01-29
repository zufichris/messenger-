import React from "react";
import {
  BsChat,
  BsChatLeftText,
  BsChatText,
  BsCircle,
  BsGear,
  BsGearFill,
  BsPerson,
  BsTelephone,
  BsUbuntu,
} from "react-icons/bs";
import NavLink from "../components/NavLink";

const SideNav = ({ image, name, onclick, settingspop }) => {
  return (
    <div className="h-full sm:w-14 flex flex-col items-center justify-between py-4 px-1 bg-gray-200">
      <div className="flex w-full flex-col gap-4 h-1/6 justify-between items-center">
        <NavLink to={"/chats"}>
          <BsChatText />
        </NavLink>

        <NavLink to={"/calls"}>
          <BsTelephone />
        </NavLink>
        <NavLink to={"/status"}>
          <BsCircle />
        </NavLink>
      </div>
      <div className="flex flex-col gap-5">
        <button
          onClick={() => settingspop()}
          className="flex items-center justify-center"
        >
          <BsGear />
        </button>
        <button
          onClick={() => onclick()}
          className="flex items-center hover:scale-105  justify-center flex-col styletext"
        >
          <div className="h-10 w-10 shadow-sm shadow-black rounded-full p-0.5 bg-green-600">
            <img src={image} className="h-full w-full rounded-full" />
          </div>
          <p style={{ fontSize: "0.1rem" }} className="font-bold styletext">
            {name?.substring(0, 6)}
          </p>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
