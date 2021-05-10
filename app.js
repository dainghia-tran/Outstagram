const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();

const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

//Router
const indexRouter = require("./routes/IndexRoutes");
const accountRouter = require("./routes/AccountRoutes");
const postRouter = require("./routes/PostRoutes");

var app = express();

//Load enviroment values
const databaseUrl = process.env.DB_URL;
const port = process.env.PORT;

//Connect to MongoDB
mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
});
mongoose.connection.once("open", () => {
    console.log("Database connection established");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//Configurations
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

//Routes
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/p", postRouter);

app.listen(() => {
    console.log("Server is running on port: " + port);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
