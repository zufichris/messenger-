import userModel from "../models/UserModel.js";
import fs from "fs";
import { generateToken } from "../config/generateToken.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const fileName = req.file?.filename;
    const basePath = `${req.protocol}://${req.get("host")}/media/`;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      res.status(400);

      throw new Error("User already exist");
    }

    const avatar = req.file
      ? `${basePath}${fileName}`
      : "http://127.0.0.1:5000/media/account-avatart-1700731532390.png";

    await userModel.create({
      name: name,
      email: email,
      avatar: avatar,
      password: password,
    });
    const newUser = await userModel.findOne({ email }).select("-password");
    return res
      .status(201)
      .send({ user: newUser, token: generateToken(newUser._id) });
  } catch (error) {
    if (req?.file) {
      fs.unlink(req?.file?.path, (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }
    res.send({
      error: error.message,
    });
  }
};
export const logUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if ((await user) && (await user.matchPassword(password))) {
      const user = await userModel.findOne({ email }).select("-password");
      return res
        .status(200)
        .send({ user: user, token: generateToken(user._id) });
    }
    res.status(404);
    throw new Error("Incorrect email or password");
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await userModel
      .find(keyword)
      .find({ _id: { $ne: req.params.userId } });
    res.send(users);
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
export const channgeBackground = async (req, res) => {
  try {
    if (req.file) {
      const fileName = req.file?.filename;
      const basePath = `${req.protocol}://${req.get("host")}/media/`;
      await userModel
        .findByIdAndUpdate(
          req.params.userId,
          {
            background: `${basePath}${fileName}`,
          },
          { new: true }
        )
        .then((r) => {
          res.send({ background: `${basePath}${fileName}` });
        });
      if (req.body.oldB) {
        fs.unlink(`media/${oldB}`, (err) => {
          console.log(err);
        });
      }
    } else {
      throw new Error("No file");
    }
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
};
