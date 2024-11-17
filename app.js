require("dotenv").config();
const express = require("express");

const app = express();

// Middleware to parte JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoute = require("./routes/userRoute");
const carRoute = require("./routes/carRoute");
const deliveryRoute = require("./routes/deliveryRoute");

app.use(userRoute);
app.use(carRoute);
app.use(deliveryRoute);

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  `The server is running in the port ${PORT}`;
});
