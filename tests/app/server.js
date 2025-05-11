const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { S, s } = require("@auaust/primitive-kit");

const pont = require("./pont.js");
const { resolveAdapter } = require("../helpers.js");
const { name, port, testAppDistDirectory } = resolveAdapter(
  process.env.PACKAGE
);

const app = express();

app.use(express.static(testAppDistDirectory));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.get("/", (req, res) =>
  pont.renderVisit(req, res, {
    page: "Home",
    title: s(name).capitalize().append(" test app").toString(),
    propsGroups: {
      page: {},
    },
  })
);

app.get("/*any", (req, res) => {
  res.sendFile(path.join(testAppDistDirectory, "index.html"));
});

app.listen(port);
