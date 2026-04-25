import express from "express";
import fileUpload from "express-fileupload";
import dnaRoutes from "./routes/dnaRoutes.js";
import variationRoutes from "./routes/variationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

// 🔥 חובה בשביל קבצים
app.use(fileUpload());

// JSON
app.use(express.json());

// Routes
app.use("/api/dna", dnaRoutes);
app.use("/api/variation", variationRoutes);
app.use("/api/upload", uploadRoutes);

// Serve UI
app.use(express.static("public"));

// Health check
app.get("/", (req, res) => {
  res.send("SongDNA API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
