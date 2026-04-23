import express from "express";
import fs from "fs";
import { extractDNA } from "../services/dnaExtractor.js";
import { deepAnalyzeDNA } from "../services/dnaDeepAnalyzer.js";
import { buildSunoPrompt } from "../services/sunoTranslator.js";

const router = express.Router();

/* =========================================
   🎧 EXTRACT DNA
========================================= */
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
    console.error("DNA EXTRACT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "DNA extraction failed",
    });
  }
});

/* =========================================
   🧠 DNA → BLUEPRINT → SUNO PROMPT
========================================= */
router.post("/blueprint", async (req, res) => {
  try {
    const { dna } = req.body;

    if (!dna) {
      return res.status(400).json({
        success: false,
        message: "dna is required",
      });
    }

    // 🔬 שלב 1 — פירוק עמוק
    const blueprint = await deepAnalyzeDNA(dna);

    if (blueprint?.error) {
      return res.status(500).json({
        success: false,
        message: blueprint.error,
      });
    }

    // 🎧 שלב 2 — תרגום ל-Suno
    const sunoPrompt = await buildSunoPrompt(blueprint);

    res.json({
      success: true,
      blueprint,
      sunoPrompt,
    });

  } catch (err) {
    console.error("DNA BLUEPRINT ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Blueprint generation failed",
    });
  }
});

export default router;
