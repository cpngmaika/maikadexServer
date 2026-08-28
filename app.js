import express from "express";
import {
  signup_get,
  login_get,
  signup_post,
  login_post,
} from "./controllers/authControllers.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/signup", signup_get);
app.get("/login", login_get);

app.post("/signup", signup_post);
app.post("/login", login_post);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});