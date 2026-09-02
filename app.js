import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Địa chỉ Frontend (ví dụ Vite)
  credentials: true                // Cho phép nhận/gửi cookie qua domain khác
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/", authRoutes);

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
