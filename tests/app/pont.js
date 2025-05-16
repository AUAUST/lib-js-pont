const { readFileSync } = require("fs");
const { resolve } = require("path");
const { resolveAdapter } = require("../helpers.js");

const { testAppDistDirectory } = resolveAdapter(process.env.PACKAGE);

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Record<string, unknown>} data
 */
function render(req, res, data) {}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {Record<string, unknown>} data
 */
function renderVisit(req, res, data) {
  data.type = "visit";
  data.url ??= req.url;

  if (req.get("X-Pont")) {
    res.header("Vary", "Accept");
    res.header("X-Pont", "true");

    return res.json(data);
  }

  return res.send(
    readFileSync(resolve(testAppDistDirectory, "index.html"))
      .toString()
      .replace("{{ initialState }}", JSON.stringify(data))
  );
}

module.exports = {
  render,
  renderVisit,
};
