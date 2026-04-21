import express from "express";
import { generateVariation } from "../services/variationEngine.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { dna, similarity, type } = req.body;

    if (!dna) {
      return res.status(400).json({
        success: false,
        message: "DNA is required"
      });
    }

    const result = await generateVariation(dna, similarity, type);

    res.json({
      success: true,
      ...result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Variation failed"
    });
  }
});

export default router;
