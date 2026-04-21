import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// סטטי - דף האתר
app.use(express.static("public"));

// גישה לקבצים שהועלו
app.use("/uploads", express.static("uploads"));

// API
app.use("/api/upload", uploadRoutes);

app.get("/health", (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
