import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin-login";
import authRoutes from "./routes/user-auth";
import favoritesRouter from "./routes/favorites";
import adminListingsRouter from "./routes/listings-management";
import listingsRouter from "./routes/listings";
import newsRouter from "./routes/news";
import adminNewsRouter from "./routes/news-management";
import formsManagementRouter from "./routes/forms-management";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRoutes);
app.use("/api/admin/listings", adminListingsRouter);
app.use("/api/admin/news-management", adminNewsRouter);
app.use("/api/admin/forms-management", formsManagementRouter);

app.use("/api/listings", listingsRouter);
app.use("/api/news", newsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRouter);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
