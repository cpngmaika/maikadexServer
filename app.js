import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", authRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
