import express from "express";
import { generateVariation } from "../services/variationEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { dna, mode } = req.body;

    if (!dna) {
      return res.status(400).json({ error: "DNA missing" });
    }

    const result = await generateVariation(dna, mode);

    if (result.error) {
      return res.status(500).json({
        success: false,
        error: result.message,
      });
    }

    res.json({
      success: true,
      newDNA: result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Variation failed" });
  }
});

export default router;
