import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to ? true : false;

  return (
    <Link
      to={to}
      className={`${
        active ? " bg-gray-300  " : ""
      } rounded-md  p-2 border-green-800  capitalize relative  items-center justify-center h-10 w-11/12 flex `}
    >
      <div className=" flex items-center justify-center">{children}</div>

      {active && (
        <div className="absolute left-0 w-1 top-2 bottom-2 flex items-center justify-center rounded-full text-green-700 bg-green-700">
          {""}
        </div>
      )}
    </Link>
  );
};

export default NavLink;
