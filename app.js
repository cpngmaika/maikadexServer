const express = require("express");
require("dotenv").config();
require("./config/db");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("MaikaDex server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});