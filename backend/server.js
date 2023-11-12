require("dotenv").config();
const express = require("express");

const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { requestTime } = require("./middleware/request-time");

const app = express();
const PORT = process.env.PORT || 3000;
const rootRoutes = require("./routes/root");
const testRoutes = require("./routes/test/index.js");

if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLiveReload());
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "static")));
app.use("/", rootRoutes);
app.use("/test", testRoutes);
app.use((_request, _response, next) => {
  next(createError(404));
});
app.use(requestTime);
app.use(morgan("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
