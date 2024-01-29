import React from "react";
import { BsCheck } from "react-icons/bs";

const SearchResult = ({ chat, onclick }) => {
  return (
    <section
      onClick={(e) => onclick(e)}
      style={{ height: "4rem" }}
      className={`flex items-center hover:bg-gray-200   relative p-2    cursor-pointer rounded-md w-full 
  }`}
    >
      <img src={chat?.avatar} className="bg-gray-600 h-10 w-10 rounded-full" />
      <div className="w-3/4 ml-2">
        <h6 style={{ fontSize: "0.9rem" }} id="h6" className="font-semibold">
          {chat?.name}
        </h6>
        <div className="flex">
          <p className="text-xs text-gray-500">Hi! I am using Piechat</p>
        </div>
      </div>
    </section>
  );
};

export default SearchResult;
