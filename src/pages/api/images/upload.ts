import nextConnect from "next-connect";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const upload = multer({
  fileFilter: (req, file, callback) => {
    if (
      req.headers.authorization &&
      req.headers.authorization == `Bearer ${process.env.AUTH_TOKEN}`
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  storage: multer.diskStorage({
    destination: "./public/photos",
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
});

const handeler = nextConnect<NextApiRequest, NextApiResponse>({});

handeler.use(upload.single("photo"));

handeler.post((req: any, res) => {
  if (req.headers.authorization) {
    if (req.headers.authorization == `Bearer ${process.env.AUTH_TOKEN}`) {
      res.status(200).json({
        name: req.file.filename,
      });
    } else {
      res.status(403).json({
        code: "INVALID_TOKEN",
        message: "Incorrect token.",
        got: req.headers.authorization,
      });
    }
  } else {
    res.json({
      error: {
        code: "NO_AUTH",
        message: "Missing authentication header",
      },
    });
  }
});

export default handeler;

export const config = {
  api: {
    bodyParser: false,
  },
};
