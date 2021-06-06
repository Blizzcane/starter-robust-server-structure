const express = require("express");
const app = express();
const flipsRouter = require("./flips/flips.router");
const countsRouter = require("./flips/flips.router");

const flips = require("./data/flips-data");
const counts = require("./data/counts-data");

app.use(express.json());
 
app.use("/flips", flipsRouter);
app.use("/counts", countsRouter);



// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;
