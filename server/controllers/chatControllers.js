import chatModel from "../models/ChatModel.js";
import userModel from "../models/UserModel.js";
export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400);
    }
    let isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.params.userId } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")

      .populate("latestMessage");
    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });
    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [userId, req.params.userId],
      };
      const createdChat = await chatModel.create(chatData);
      const fullChat = await chatModel
        .findById(createdChat._id)
        .populate("users", "-password");
      res.status(201).send(fullChat);
    }
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const fetchChats = async (req, res) => {
  try {
    let chats = await chatModel
      .find({
        users: { $elemMatch: { $eq: req.params.userId } },
      })

      .populate("users", "-password")

      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    chats = await userModel.populate(chats, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });
    res.send(chats);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.chatName) {
      res.status(400);
      throw new Error("Please enter all fields");
    }

    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
      res.status(400);
      throw new Error("Group must contain 2 or more members");
    }
    users.push(req.params.userId);
    const groupChat = await chatModel.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.params.userId,
      avatar: "http://127.0.0.1:5000/media/group-icon-1701001415585.png",
    });
    const fullGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(201).send(fullGroupChat);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const updateGroup = async (req, res) => {
  const users = JSON.parse(req.body.users);
  users.push(req.params.userId);
  try {
    const { chatId } = req.params;
    const added = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          users: users,
          chatName: req.body.chatName,
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      throw new Error("Error occured");
    }
    res.status(200).send(added);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const removed = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        { new: true }
      )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      throw new Error("Error occured");
    }
    res.status(200).send(removed);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
