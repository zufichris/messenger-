import messageModel from "../models/MessageModel.js";
import userModel from "../models/UserModel.js";
import chatModel from "../models/ChatModel.js";
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    if (!content || !chatId) {
      res.status(200);
      throw new Error("enter all fields");
    }
    let newMessage = {
      sender: req.params.userId,
      content: content,
      chat: chatId,
    };
    let message = await messageModel.create(newMessage);

    message = await message.populate("sender", "name avatar email");
    message = await chatModel.populate(await message, {
      path: "chat",
    });
    message = await userModel.populate(await message, {
      path: "chat.users",
      select: "name email avatar",
    });
    await chatModel.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.status(201).send(message);
  } catch (error) {
    res.status(400);
    res.send({
      error: error.message,
    });
  }
};
export const getMessages = async (req, res) => {
  try {
    const messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.send(messages);
  } catch (error) {
    res.status(400);
    res.send({
      error: error.message,
    });
  }
};
