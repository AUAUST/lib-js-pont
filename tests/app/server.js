const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

const { resolveAdapter } = require("../helpers.js");

const { port, testAppDistDirectory } = resolveAdapter(process.env.PACKAGE);

const app = express();
const upload = multer();

// app.use(express.static(testAppDistDirectory));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.get("/*any", (req, res) => {
  res.sendFile(path.join(testAppDistDirectory, "index.html"));
});

app.get("/debug", (req, res) => {
  res.json({
    message: "Hello from the debug route!",
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
});

app.listen(port);
