import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { detectLang } from "./middleware/detectLang";
import adminRoutes from "./routes/admin-login";
import authRoutes from "./routes/user-auth";
import favoritesRouter from "./routes/favorites";
import adminListingsRouter from "./routes/listings-management";
import listingsRouter from "./routes/listings";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/admin", adminRoutes);
app.use("/api/admin/listings", adminListingsRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRouter);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
