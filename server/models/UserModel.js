import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userScema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    background: {
      type: String,
      default: "http://127.0.0.1:5000/media/whatsapp-bg-1701015045903.png",
    },
    bio: {
      type: String,
      default: "Hi! I am using Piechat",
    },
  },
  {
    timestamps: true,
  }
);
userScema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(this.password, salt);
  this.password = await hashedpassword;
});
userScema.methods.matchPassword = async function (password) {
  console.log(password);
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("Users", userScema);
export default userModel;
