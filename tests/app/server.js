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

app.use(express.static(testAppDistDirectory, { index: false }));
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

app.get("/about", (req, res) =>
  pont.renderVisit(req, res, {
    page: "About",
    title: "About us!",
    propsGroups: {
      page: {},
    },
  })
);

app.listen(port, () => console.log(`Server is running on port ${port}`));
