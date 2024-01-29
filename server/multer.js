import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media");
  },
  filename: (req, file, cb) => {
    const fileName = `${
      file.originalname.split(" ").join("-").split(".")[0]
    }-${Date.now()}.png`;
    cb(null, fileName);
  },
});
export const mediaUpload = multer({ storage });
