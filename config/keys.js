if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "developement")
  module.exports = require("../config/keys.prod");
else module.exports = require("../config/keys.dev");
