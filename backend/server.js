const path = require("path");
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const { viewSessionData } = require("./middleware/view-session");
const morgan = require("morgan");
// const { requestTime } = require("./middleware/request-time");

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(requestTime);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV !== "development" }
}));
if(process.env.NODE_ENV === "development"){
  app.use(viewSessionData);
}

const landingRoutes = require("./routes/landing");
const lobbyRoutes = require("./routes/lobby");
const gameRoutes = require("./routes/game");
const authRoutes = require("./routes/authentication");
// const testRoutes = require("./routes/test/index"); 

app.use("/", landingRoutes);
app.use("/lobby", lobbyRoutes);
app.use("/game", gameRoutes);
app.use("/auth", authRoutes);
// app.use("/test", testRoutes);

app.use((_request, _response, next) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
