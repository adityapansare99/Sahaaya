import multer from "multer";
import { ApiError } from "../utils/apiError.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    const randomname = Date.now();
    cb(null, file.fieldname + "-" + randomname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new ApiError(400, "Only image files (JPEG, PNG, WEBP) are allowed"));
  },
});

export { upload };
