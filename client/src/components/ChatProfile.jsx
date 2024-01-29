import React, { useEffect, useState } from "react";
import { BsPencilFill, BsXCircleFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { server } from "../server";
import { axiosInstance } from "../api/axiosInstance";

const ChatProfile = ({ chat, onclick }) => {
  const user = useSelector((state) => state.user);
  const [currentChat, setCurrentChat] = useState(chat);
  const [users, setUsers] = useState(currentChat?.users);
  const [admin, setAdmin] = useState(chat?.groupAdmin === user?.id);
  const [state, setstate] = useState(false);
  const removeFromGroup = async (e, u) => {
    if (currentChat?.users?.length > 3) {
      await axiosInstance
        .put(`${server}/api/chats/remove-from-group`, {
          chatId: currentChat?._id,
          userId: u?._id,
        })

        .then((res) => {
          users?.pop(u);
          setstate((c) => !c);
          e.target.disabled = true;
        })
        .catch((err) => {});
    } else {
      alert("Group cannot have less than 3 members");
    }
  };
  useEffect(() => {
    setUsers(users);
  }, [state]);
  return (
    <div className="w-full flex flex-col items-center justify-between p-4 gap-6">
      <h6 className=" text-xl font-bold text-green-600">Chat Profile</h6>
      <div className="w-full items-center flex flex-col gap-2">
        <img
          src={
            currentChat?.isGroupChat
              ? currentChat?.avatar
              : currentChat?.users
                  ?.map((u) => {
                    return u?.email !== user?.email ? u?.avatar : "";
                  })
                  .join("")
          }
          className="h-10 w-10 rounded-full"
        />
        <p className="text-xl font-semibold">
          {currentChat?.isGroupChat
            ? currentChat?.chatName
            : currentChat?.users
                ?.map((u) => {
                  return u?.email !== user?.email ? u?.name : "";
                })
                .join("")}
        </p>
        {!currentChat?.isGroupChat && (
          <p className="text-xl font-semibold">
            {currentChat?.users
              ?.map((u) => {
                return u?.email !== user?.email ? u?.email : "";
              })
              .join("")}
          </p>
        )}
        {currentChat?.isGroupChat && (
          <div className="flex w-full  flex-col">
            {!admin && (
              <div className="text-red-600 font-light text-xs w-full text-center">
                Only admins can make changes to the group
              </div>
            )}
            <button
              onClick={(e) => {
                onclick(e);
              }}
              disabled={!admin}
              className="flex rounded-md w-1/3 self-center my-0.5 disabled:opacity-25 items-center justify-center p-1 bg-green-600 text-white"
            >
              Edit Group
              <BsPencilFill />
            </button>
            {users?.map((u, i) => {
              return u?.email !== user?.email ? (
                <div
                  key={i}
                  className="flex  cursor-pointer hover:bg-gray-200 hover:scale-105 relative items-center justify-between rounded-md mt-0.5 p-0.5 w-3/4 self-center"
                >
                  <img src={u?.avatar} className="h-6 w-6 rounded-full" />
                  <p style={{ fontSize: "0.7rem" }}>{u?.name}</p>

                  <button
                    onClick={(e) => {
                      removeFromGroup(e, u);
                    }}
                    disabled={!admin}
                    className=" disabled:opacity-25 p-1 text-xs font-light rounded-md text-white bg-red-600"
                  >
                    remove
                  </button>
                </div>
              ) : (
                ""
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatProfile;
