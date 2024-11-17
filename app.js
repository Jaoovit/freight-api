require("dotenv").config();
const express = require("express");
const initializeSession = require("./config/session");

const app = express();

// Middleware to conf cors permission
const corsMiddleware = require("./config/cors");
app.use(corsMiddleware);

// Middleware to parte JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prisma session configuration
initializeSession(app);

// Routes
const userRoute = require("./routes/userRoute");
const carRoute = require("./routes/carRoute");
const deliveryRoute = require("./routes/deliveryRoute");
const sessionRoute = require("./routes/sessionRoute");

app.use(userRoute);
app.use(carRoute);
app.use(deliveryRoute);
app.use(sessionRoute);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});
