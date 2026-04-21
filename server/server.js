import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import dnaRoutes from "./routes/dnaRoutes.js";
import variationRoutes from "./routes/variationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/api/upload", uploadRoutes);
app.use("/api/dna", dnaRoutes);
app.use("/api/variation", variationRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
