import express from "express";
import { generateVariation } from "../services/variationEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { dna, mode } = req.body;

    const result = await generateVariation(dna, mode);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
