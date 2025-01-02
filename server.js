import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import authRoutes from './routes/authRoutes.js'
import verifyTokenRoute from './routes/verifyTokenRoute.js'
import ownerAuthRoutes from "./routes/ownerAuthRoutes.js";
import fileUpload from 'express-fileupload';
import restaurantRoutes from './routes/restaurantRoutes.js'




const app = express()
const PORT = 3001
dotenv.config();
// app.use(cors({
//     origin: "https://foodapp-six-lemon.vercel.app/",
//     credentials: true,
//   }));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://foodapp-six-lemon.vercel.app/", "https://foodapp-six-lemon.vercel.app/user/login"],
    credentials: true, // Enable credentials (cookies)
  })
);

  

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDb();
// Routes


// Enable file upload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/', // Specify a temp directory for file storage
}));
app.use("/auth", authRoutes); // Add the team routes
app.use("/admin", ownerAuthRoutes); // Add the team routes
app.use("/verify", verifyTokenRoute);
app.use("/restaurant", restaurantRoutes);

app.listen(PORT, (req, res)=>{
    console.log(`Serve is runnng on http://localhost:${PORT}`)
})