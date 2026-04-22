import express from "express";
import { generateVariation, generateAutoRemix } from "../services/variationEngine.js";

const router = express.Router();

// רגיל
router.post("/generate", async (req, res) => {
  try {
    const { dna, similarity, type } = req.body;

    if (!dna) {
      return res.status(400).json({ success: false });
    }

    const result = await generateVariation(dna, similarity, type);

    res.json({
      success: true,
      ...result
    });

  } catch {
    res.status(500).json({ success: false });
  }
});

// 🔥 AUTO REMIX
router.post("/auto-remix", async (req, res) => {
  try {
    const { dna, similarity, type } = req.body;

    if (!dna) {
      return res.status(400).json({ success: false });
    }

    const result = await generateAutoRemix(dna, similarity, type);

    res.json(result);

  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;
