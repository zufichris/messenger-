import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Messages = ({ _messages }) => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState(_messages);
  const colors = ["orange", "blue", "purple", "pink", "cyan"];
  const [num, _] = useState(0);
  useEffect(() => {
    setMessages(_messages);
  }, [_messages]);
  useEffect(() => {
    _(Math.round(Math.random() * 5));
  }, []);
  window.scrollTo(0, document);
  return (
    <div className="p-1 flex flex-col flex-wrap overflow-y-auto">
      {messages?.length
        ? messages?.map((message, i) => {
            return (
              <div
                style={{
                  maxWidth: "60%",
                  minWidth: "10%",
                  minHeight: "20px",
                  fontWeight: "600",
                  padding: "10px",
                }}
                className={`relative ${
                  message?.sender?.email === user?.email
                    ? "bg-green-400 bg-opacity-90  text-white rounded-br-none self-end"
                    : "bg-blue-300 ml-4 bg-opacity-90 rounded-bl-none self-start"
                }  rounded-md my-0.5 ${
                  !isSameUser(messages, message, i) ? "mt-10" : "m-0"
                } shadow-sm shadow-gray-900 p-0.5 pb-6`}
              >
                {message?.chat?.isGroupChat && (
                  <p
                    style={{
                      color: colors[num],
                    }}
                    className={`italic  font-semibold text-xs`}
                  >
                    {message?.sender?.email !== user?.email &&
                      `~${message?.sender?.name}`}
                  </p>
                )}
                <p
                  style={{ lineBreak: "anywhere" }}
                  className="w-full p-0.5 h-full"
                >
                  {message?.content}
                </p>
                <p className="absolute bottom-0.5 right-0.5 text-xs  font-semibold">
                  {message?.chat?.updatedAt
                    ?.split("T")[1]
                    ?.split(".")[0]
                    ?.substring(0, 5)
                    ?.split(":")[0] < 12
                    ? `${message?.chat?.updatedAt
                        ?.split("T")[1]
                        ?.split(".")[0]
                        ?.substring(0, 5)}am`
                    : `${message?.chat?.updatedAt
                        ?.split("T")[1]
                        ?.split(".")[0]
                        ?.substring(0, 5)}pm`}
                </p>
                {user?.id !== message.sender._id &&
                  (isSameSender(messages, message, i, "") ||
                    isLastMessage(messages, i, user.id)) && (
                    <img
                      src={message?.sender?.avatar}
                      className="h-5 w-5 rounded-full absolute -bottom-1 -left-5"
                    />
                  )}
              </div>
            );
          })
        : ""}
    </div>
  );
};
const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id === userId &&
    messages[messages.length - 1].sender._id
  );
};
const isFirstMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[i].sender._id === userId &&
    messages[0].sender._id
  );
};
const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender?._id !== m.sender._id ||
      messages[i + 1].sender?._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
const senderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id !== m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

const generateColor = () => {
  for (let index = 0; index < 100; index++) {
    return `#${Math.round(Math.random() * 16777215).toString(16)}`;
  }
};

export default Messages;
