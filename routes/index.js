const express = require("express");

const app = express();

app.use("/action", require("./home.route"));

module.exports = app;