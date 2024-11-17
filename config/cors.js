const cors = require("cors");

const PRODUCTION_URL = process.env.PRODUCTION_URL;

const corsOptions = {
  origin: PRODUCTION_URL,
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
