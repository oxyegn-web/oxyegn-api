const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./src/routes/auth.route");
const productRouter = require("./src/routes/product.route");

const app = express();

app.use(cors());
app.options("*", cors());

//serving static file
app.use(express.static(path.join(__dirname, "public")));

//set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//set rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request for this Ip, please try again in a hour",
});
//limiter affect only all /api route
app.use("/api", limiter);

//Body parser, reading data from body int req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against xss=html code with js convert to entity
app.use(xss());

//prevent parameter pollutions
app.use(
  hpp({
    whitelist: [],
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "Fail";
  err.statusCode = 400;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
module.exports = app;
