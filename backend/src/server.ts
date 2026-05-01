import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin-login.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/user-auth.js";
import favoritesRouter from "./routes/favorites.js";
import adminListingsRouter from "./routes/listings-management.js";
import listingsRouter from "./routes/listings.js";
import newsRouter from "./routes/news.js";
import adminNewsRouter from "./routes/news-management.js";
import formsManagementRouter from "./routes/forms-management.js";
import filesRouter from "./routes/images.js";
import uploadRouter from "./routes/upload.js";
import formsRouter from "./routes/forms.js";
import cors from "cors";
import cron from "node-cron";
import { cleanupTempImages } from "./jobs/cleanupImage.js";
import { testSMTP } from "./services/email.js";
import { langMiddleware } from "./middleware/lang.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(langMiddleware);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/listings", adminListingsRouter);
app.use("/api/admin/aktuality", adminNewsRouter);
app.use("/api/admin/forms-management", formsManagementRouter);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/files", uploadRouter);

app.use("/api/listings", listingsRouter);
app.use("/api/news", newsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRouter);
app.use("/api/forms", formsRouter);

app.use("/api/files", filesRouter);
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
  testSMTP();
  console.log(`Server running on ${PORT}`);
});
