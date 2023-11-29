const path = require("path");

const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const { viewSessionData, sessionLocals, isAuthenticated, requestTime} = require("./middleware");

const app = express();

app.use(requestTime);
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

const PORT = process.env.PORT || 3000;

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

const sessionMiddleware = {
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { secure: process.env.NODE_ENV !== "development" }
}

app.use(session(sessionMiddleware));

if(process.env.NODE_ENV === "development"){
  app.use(viewSessionData);
}
app.use(sessionLocals)

const Routes= require("./routes");
app.use("/", Routes.landing);
app.use("/auth", Routes.authentication);
app.use("/lobby", isAuthenticated, Routes.lobby);
app.use("/game", isAuthenticated, Routes.game);

app.use((_request, _response, next) => {
  next(createError(404));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// require("dotenv").config();

// const path = require("path");
// const express = require("express");
// const createError = require("http-errors");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const connectPgSimple = require("connect-pg-simple")(session);

// const { viewSessionData, sessionLocals, isAuthenticated, requestTime } = require("./middleware");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // sessions connect
// app.use(session({
//   secret: process.env.SESSION_SECRET, 
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   }
// }));
  

// // our parsing middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static files, logging, views setup
// app.use(express.static(path.join(__dirname, "static")));
// app.use(morgan("dev"));
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// // Live reload configuration (for only in development)
// if (process.env.NODE_ENV === "development") {
//   const livereload = require("livereload");
//   const connectLiveReload = require("connect-livereload");

//   const liveReloadServer = livereload.createServer();
//   liveReloadServer.watch(path.join(__dirname, "static"));
//   liveReloadServer.server.once("connection", () => {
//     setTimeout(() => {
//       liveReloadServer.refresh("/");
//     }, 100);
//   });

//   app.use(connectLiveReload());
// }

// // more middleware
// app.use(cookieParser());
// app.use(requestTime);

// // Route middlewares
// app.use("/", require("./routes/landing"));
// app.use("/auth", require("./routes/authentication"));
// app.use("/lobby", isAuthenticated, require("./routes/lobby"));
// app.use("/game", isAuthenticated, require("./routes/game"));

// // 404 error handler
// app.use((_req, _res, next) => {
//   next(createError(404));
// });

// // Error for handling middleware
// app.use((err, req, res, _next) => {
//   res.status(err.status || 500);
//   // res.render('error', { error: err }); 
// });

// // starting server
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
