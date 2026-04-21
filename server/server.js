import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// מאפשר גישה לקבצים שהועלו
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SongDNA Server is running 🚀"
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok"
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
