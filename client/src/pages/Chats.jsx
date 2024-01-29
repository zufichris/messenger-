import React, { useEffect, useRef, useState } from "react";
import SideNav from "../components/SideNav";
import {
  BsArrowLeft,
  BsArrowLeftSquareFill,
  BsCameraVideo,
  BsDot,
  BsEmojiSmile,
  BsEmojiSmileFill,
  BsFilter,
  BsPencilSquare,
  BsPlus,
  BsSend,
  BsSendCheck,
  BsSendFill,
  BsTelephone,
  BsXCircleFill,
} from "react-icons/bs";

import SingleChat from "../components/SingleChat";
import { useSelector } from "react-redux";
import { axiosInstance } from "../api/axiosInstance";
import { server } from "../server";
import { useNavigate } from "react-router-dom";
import SearchResult from "../components/SearchResult";
import CreateGroup from "../components/CreateGroup";
import UserProfile from "../components/UserProfile";
import ChatProfile from "../components/ChatProfile";
import Messages from "../components/Messages";
import Settings from "../components/Settings";
const Chats = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (!user?.name) {
      navigate("/");
    }
  }, []);
  //fetchChats
  const [chats, setChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const fetchChats = async () => {
    await axiosInstance
      .get(`${server}/api/chats/`)
      .then((res) => {
        setChats(res.data);
      })
      .catch((err) => {});
  };
  //currentchat
  const [show, setShow] = useState(true);
  const handleCurrentChat = (e, chat) => {
    setCurrentChat(chat);
    setShow(true);
  };
  //searchchats
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const searchChats = async (search) => {
    await axiosInstance
      .get(`${server}/api/users?search=${search}`)
      .then((res) => {
        setSearchResults(res.data);
      })
      .catch((err) => {});
  };
  //searchResultAppend
  const handleAppend = async (e, resultUser) => {
    await axiosInstance
      .post(`${server}/api/chats/`, {
        userId: resultUser?._id,
      })
      .then((res) => {
        if (res.status === 201) {
          setChats([res.data, ...chats]);
          setCurrentChat(res.data);
        } else {
          setCurrentChat(res.data);
        }
        setSearching(false);
      })
      .catch((err) => {});
  };
  //popUps
  const [popUp, setPopUp] = useState(false);
  const [createGroupPop, setCreateGroupPop] = useState(false);
  const [userprofilePop, setUserProfilePop] = useState(false);
  const [chatProfPop, setChatProfPop] = useState(false);
  const [editingGroup, setEditing] = useState(false);
  const [settingspop, setsettingspop] = useState(false);
  //effect
  useEffect(() => {
    fetchChats();
  }, []);
  //fetch messages

  const [messages, setMessages] = useState(null);
  const [sendBtn, setSendBtn] = useState(false);
  const [sent, setSent] = useState(false);
  const fetchMessages = async () => {
    if (currentChat) {
      await axiosInstance
        .get(`${server}/api/messages/${currentChat?._id}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {});
    }
  };
  //sendmessage
  const [messageContent, setMessageCont] = useState(null);
  const input = useRef();
  const [fetchAgain, setFetchAgain] = useState(false);
  const send = async (content) => {
    await axiosInstance
      .post(`${server}/api/messages/`, {
        chatId: currentChat?._id,
        content: content,
      })
      .then((res) => {
        setMessages(res.data);
        setFetchAgain((c) => !c);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    fetchChats();
    fetchMessages();
  }, [currentChat?._id, fetchAgain]);

  document.onkeydown = async (e) => {
    if (e.code === "Enter" && e.target.value === messageContent) {
      if (messageContent) {
        await send(messageContent);
        e.target.value = "";
      }
    }
  };
  const backgroundImage = `url(${user.background})`;

  return (
    <>
      {show && (
        <button
          onClick={() => setShow(false)}
          className="fixed sm:hidden top-2 left-2 text-gray-600"
        >
          <BsArrowLeftSquareFill size={"1.5rem"} />
        </button>
      )}
      <section
        className={`${
          popUp ? "opacity-20" : ""
        } h-screen  text-gray-900 pt-10 flex w-screen  bg-gray-200`}
      >
        <SideNav
          onclick={() => {
            setPopUp(true);
            setUserProfilePop(true);
          }}
          settingspop={() => {
            setPopUp(true);
            setsettingspop(true);
          }}
          name={user?.name}
          image={user?.avatar}
        />
        <div
          className={`w-full ${
            show ? "hidden" : ""
          } sm:block sm:w-1/3 chat-scroll overflow-y-auto bg-white  overflow-hidden border-2   h-full pt-6 px-3 pb-2  relative shadow-sm  shadow-gray-500  rounded-tl-lg`}
        >
          <div className="px-7 chat-head  rounded-tl-md h-24  pb-2 z-50 bg-white fixed gap-4 flex flex-col items-center justify-center">
            <div className="flex w-full items-center justify-between ">
              <h1 className="text-xl font-semibold">Chats</h1>
              <div className="flex items-center justify-center gap-10">
                <button
                  onClick={() => {
                    setPopUp(true);
                    setCreateGroupPop(true);
                  }}
                  className="flex items-center justify-center hover:scale-105 gap-1 text-xs ml-2"
                >
                  <BsPencilSquare className="text-gray-700" /> New Group
                </button>
                <button>
                  <BsFilter size={"1.2rem"} className="text-gray-700" />
                </button>
              </div>
            </div>
            <input
              onChange={(e) => {
                if (e.target.value === "") {
                  setSearching(false);
                } else {
                  setSearching(true);
                  searchChats(e.target.value?.trim());
                }
              }}
              onFocus={() => setSearching(true)}
              autoCorrect="false"
              type="search"
              className="w-full
              
              
              
              
              
              search font-light shadow-sm shadow-gray-700 placeholder:text-gray-950  pl-4 py-1 px-0.5 rounded-md text-sm"
              placeholder="Search or start new chat..."
            />
          </div>
          <div className="pt-20 w-full">
            {!searching && chats?.length
              ? chats?.map((chat, i) => {
                  return (
                    <>
                      <SingleChat
                        currentChat={currentChat}
                        onclick={(e) => handleCurrentChat(e, chat)}
                        _chat={chat}
                        key={i}
                      />
                    </>
                  );
                })
              : ""}
            {searching && searchResults?.length
              ? searchResults.map((chat, i) => {
                  return (
                    chat?.name !== user?.name && (
                      <SearchResult
                        chat={chat}
                        onclick={(e) => handleAppend(e, chat)}
                        key={i}
                      />
                    )
                  );
                })
              : ""}
          </div>
        </div>
        <div
          className={`bg-blue-50 ${
            show ? "block w-full" : "hidden"
          }  h-full relative`}
        >
          {currentChat && (
            <>
              <div className="bg-white  flex   items-center justify-between w-full h-16 p-4 shadow-sm shadow-black">
                <div
                  onClick={() => {
                    setChatProfPop(true);
                    setPopUp(true);
                  }}
                  style={{ transition: "0.5s all-ease" }}
                  className="flex cursor-pointer w-1/2 hover:scale-105 items-center justify-center styletext font-bold text-sm gap-2"
                >
                  <img
                    src={
                      currentChat?.isGroupChat
                        ? currentChat?.avatar
                        : currentChat?.users
                            ?.map((u) => {
                              return user?.email !== u?.email ? u?.avatar : "";
                            })
                            ?.join("")
                    }
                    style={{ height: "3rem", width: "3rem" }}
                    className="rounded-full"
                  />
                  <div className="w-full flex flex-col justify-center">
                    <h6 className="text-xs sm:text-base">
                      {currentChat?.isGroupChat
                        ? currentChat?.chatName
                        : currentChat?.users
                            ?.map((u) => {
                              return user?.email !== u?.email ? u?.name : "";
                            })
                            .join("")}
                    </h6>
                    <p className="w-full flex overflow-hidden">
                      {currentChat?.isGroupChat ? (
                        currentChat?.users?.map((u) => {
                          return (
                            u?.email !== user?.email && (
                              <div
                                style={{ fontSize: "0.8rem" }}
                                className="font-light flex items-center"
                              >
                                <img
                                  src={u?.avatar}
                                  className="h-4 w-4 sm:h-6 sm:w-6 rounded-full"
                                />
                                <p>{u?.name?.substring(0, 5)}</p>
                              </div>
                            )
                          );
                        })
                      ) : (
                        <p className="font-light text-xs flex items-center justify-center">
                          <BsDot size={"1.5rem"} className="text-green-600" />
                          online
                        </p>
                      )}
                    </p>
                  </div>
                </div>

                <div className=" flex items-center justify-center gap-4">
                  <BsCameraVideo size={"1.2rem"} className="text-gray-600" />
                  <BsTelephone size={"1.2rem"} className="text-gray-600" />
                </div>
              </div>
              {messages && (
                <div
                  style={{
                    backgroundImage: backgroundImage,
                    height: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%",

                    paddingBottom: "110px",
                  }}
                  className="w-full  px-1 pt-4 relative overflow-y-auto"
                  autoFocus
                >
                  <div className="w-full flex items-center justify-center">
                    <div
                      style={{ minWidth: "30%" }}
                      className="self-center  rounded-md bg-gray-600 text-gray-200 bg-opacity-50 text-sm font-semibold italic text-center p-1 mb-2"
                    >{`chat created At ${
                      currentChat?.createdAt?.split("T")[0]
                    },${
                      currentChat?.createdAt
                        ?.split("T")[1]
                        ?.split(".")[0]
                        ?.substring(0, 5)
                        ?.split(":")[0] < 12
                        ? `${currentChat?.createdAt
                            ?.split("T")[1]
                            ?.split(".")[0]
                            ?.substring(0, 5)}am`
                        : `${currentChat?.createdAt
                            ?.split("T")[1]
                            ?.split(".")[0]
                            ?.substring(0, 5)}pm`
                    }`}</div>
                  </div>
                  <Messages _messages={messages} />
                </div>
              )}
              <div className="w-full absolute bottom-0 h-10 flex items-center justify-between bg-white p-2">
                <button className="items-center justify-center flex">
                  <BsEmojiSmile className="text-gray-300" />
                </button>
                <input
                  ref={input}
                  onChange={(e) => {
                    setMessageCont(e.target.value);
                    if (e.target.value) {
                      setSendBtn(true);
                    } else {
                      setSendBtn(false);
                    }
                  }}
                  type="text"
                  placeholder="Type message and press Enter..."
                  className="w-11/12 text p-0.5 focus:border-2 bg-gray-200 rounded-md pl-2 placeholder:pl-4 focus:bg-white border-green-100"
                />
                <button
                  disabled={true}
                  className="flex items-center  justify-center text-green-600 disabled:hidden disabled:text-gray-100 disabled:scale-95 scale-105 "
                >
                  <BsSend />
                </button>
              </div>
            </>
          )}
          {!currentChat && (
            <div className="h-full w-full flex items-center justify-center text-2xl font-extralight bg-green-100">
              Click on a chat to start Chatting🙂
            </div>
          )}
        </div>
      </section>
      {popUp && (
        <div className="fixed bg-opacity-5 overflow-y-auto  top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-transparent flex-col">
          <div className="relative sm:w-1/3 w-3/4 p-2 m-2 rounded-md shadow-sm shadow-black bg-white">
            {createGroupPop && (
              <CreateGroup
                edit={editingGroup}
                chat={editingGroup ? currentChat : null}
              />
            )}
            {userprofilePop && <UserProfile user={user} />}
            {chatProfPop && (
              <ChatProfile
                chat={currentChat}
                onclick={(e) => {
                  setChatProfPop(false);
                  setCreateGroupPop(true);

                  setEditing(true);
                }}
              />
            )}
            {settingspop && <Settings />}
          </div>
          <button
            onClick={() => {
              setCreateGroupPop(false);
              setUserProfilePop(false);
              setChatProfPop(false);
              setPopUp(false);
              setsettingspop(false);
            }}
            className="h-10 w-10"
          >
            <BsXCircleFill className="w-full h-full rounded-full hover:scale-105 hover:text-gray-600 text-gray-500 shadow-sm shadow-black" />
          </button>
        </div>
      )}
    </>
  );
};

export default Chats;
