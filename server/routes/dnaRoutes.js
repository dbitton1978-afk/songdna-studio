import express from "express";
import { extractDNA } from "../services/dnaExtractor.js";
import fs from "fs";

const router = express.Router();

router.post("/extract", async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileUrl is required",
      });
    }

    const filePath = fileUrl.replace("/uploads/", "uploads/");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const dna = await extractDNA(filePath);

    res.json({
      success: true,
      dna,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "DNA extraction failed",
    });
  }
});

export default router;
