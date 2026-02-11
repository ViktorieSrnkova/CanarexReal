import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin-login";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
