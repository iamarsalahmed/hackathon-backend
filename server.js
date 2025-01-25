import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import authRoutes from "./routes/userRoutes.js";
import authenticateToken from "./middleware/authenticateToken.js";
import adminRoutes from "./routes/adminRoutes.js";
import fileUpload from "express-fileupload";
import restaurantRoutes from "./routes/restaurantRoutes.js";

const app = express();
const PORT = 5000;
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hackathon-frontend-omega.vercel.app/",

    ],
    credentials: true, // Enable credentials (cookies)
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDb();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Specify a temp directory for file storage
  })
);
app.use("/user", authRoutes); // Add the team routes
app.use("/admin", adminRoutes); // Add the team routes
app.use("/verify", authenticateToken);
app.use("/restaurant", restaurantRoutes);

app.listen(PORT, (req, res) => {
  console.log(`Serve is runnng on http://localhost:${PORT}`);
});
