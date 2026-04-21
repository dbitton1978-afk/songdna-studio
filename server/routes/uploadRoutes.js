import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// יצירת תיקיית uploads אם לא קיימת
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// הגדרת אחסון
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// העלאת קובץ
router.post("/", upload.single("file"), (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      fileUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

export default router;
