import React, { useEffect, useState } from "react";
import { BsCheck, BsCheck2 } from "react-icons/bs";
import { useSelector } from "react-redux";

const SingleChat = ({ _chat, onclick, currentChat }) => {
  const user = useSelector((state) => state.user);
  const [chat, setChat] = useState(_chat);
  const selected = chat?._id === currentChat?._id;

  const [latestMessage, setLatest] = useState(
    chat?.latestMessage?.content || "start chat"
  );
  useEffect(() => {
    setChat(_chat);
    setLatest(chat?.latestMessage?.content || "start chat");
  }, [currentChat]);
  return (
    <section
      onClick={(e) => onclick(e)}
      style={{ height: "4rem", transition: "0.5s" }}
      className={`${
        selected ? "bg-gray-300 my-1 scale-105" : "hover:bg-gray-100"
      } flex items-center   relative p-2    cursor-pointer rounded-md w-full 
      }`}
    >
      <img
        src={
          chat?.isGroupChat
            ? chat?.avatar
            : chat?.users
                ?.map((u) => {
                  return user?.email !== u?.email ? u?.avatar : "";
                })
                .join("")
        }
        className="bg-gray-600 h-10 w-10 rounded-full"
      />
      <div className="w-3/4 ml-2">
        <h6 style={{ fontSize: "0.9rem" }} id="h6" className="font-semibold">
          {chat?.isGroupChat
            ? chat?.chatName
            : chat?.users
                ?.map((u) => {
                  return u?.email !== user?.email ? u?.name : "";
                })
                .join("")}
        </h6>
        <div className="flex w-full  items-center ">
          {chat?.latestMessage?.sender?.email === user?.email && (
            <div className="text-blue-600 flex items-center justify-center w-6">
              {chat?.latestMessage?.sender?.email === user?.email && (
                <>
                  <BsCheck2 />
                  <BsCheck2 />
                </>
              )}
            </div>
          )}
          <p className="text-xs text-gray-500 overflow-hidden self-start w-full">
            {chat?.isGroupChat
              ? `${
                  chat?.latestMessage?.sender?.email !== user?.email
                    ? chat?.latestMessage?.sender?.name?.substring(0, 10) || ""
                    : "You"
                }:${latestMessage?.substring(0, 10)}`
              : `${latestMessage?.substring(0, 10)}`}
          </p>
        </div>
      </div>
      <p className="absolute top-2 right-2 text-xs">
        {chat?.updatedAt
          ?.split("T")[1]
          ?.split(".")[0]
          ?.substring(0, 5)
          ?.split(":")[0] < 12
          ? `${chat?.updatedAt
              ?.split("T")[1]
              ?.split(".")[0]
              ?.substring(0, 5)}am`
          : `${chat?.updatedAt
              ?.split("T")[1]
              ?.split(".")[0]
              ?.substring(0, 5)}pm`}
      </p>
    </section>
  );
};

export default SingleChat;
