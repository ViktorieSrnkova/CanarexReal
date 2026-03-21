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
import uploadRouter from "./routes/upload";
import cors from "cors";
import cron from "node-cron";
import { cleanupTempImages } from "./jobs/cleanupImage";

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
app.use("/api/admin/aktuality", adminNewsRouter);
app.use("/api/admin/forms-management", formsManagementRouter);

app.use("/api/listings", listingsRouter);
app.use("/api/news", newsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRouter);
app.use("/api/admin/files", uploadRouter);

//app.use("/api/admin/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

cron.schedule("0 * * * *", async () => {
  console.log("Running cleanup job...");
  await cleanupTempImages();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
