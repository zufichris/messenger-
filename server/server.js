import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/", express.static("media"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
connectDb();

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.get("/media/:imagename", (req, res) => {
  try {
    const readStream = fs.createReadStream(`media/${req.params.imagename}`);
    readStream.pipe(res);
  } catch (error) {
    console.log(error);
  }
});
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running");
});
