// const express = require("express");
// const path = require("path");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const nunjucks = require("nunjucks");
// const dotenv = require("dotenv");
// const ColorHash = require("color-hash");

// dotenv.config();
// const webSocket = require("./socket");
// const indexRouter = require("./routes");
// const connect = require("./schemas");

// const app = express();
// app.set("port", process.env.PORT || 8005);
// app.set("view engine", "html");
// nunjucks.configure("views", {
//   express: app,
//   watch: true,
// });
// connect();

// app.use(morgan("dev"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//     },
//   })
// );

// app.use((req, res, next) => {
//   if (!req.session.color) {
//     const colorHash = new ColorHash();
//     req.session.color = colorHash.hex(req.sessionID);
//   }
//   next();
// });

// app.use("/", indexRouter);

// app.use((req, res, next) => {
//   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
//   error.status = 404;
//   next(error);
// });

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
//   res.status(err.status || 500);
//   res.render("error");
// });

// const server = app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기중");
// });

// webSocket(server, app);

//
//
//
//

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

//프로세스 env 적용하기
dotenv.config();
//socket.js에서 웹소켓을 불러와서
const webSocket = require("./socket");
const indexRouter = require("./routes");

const app = express();
app.set("port", process.env.PORT || 8005);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", indexRouter);

//404 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

//에러처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

//express 서버를 server변수에 담아서 아래에서 연결!
const server = app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

//socket.js에서의 웹소켓 서버와 express 서버를 연결해주는 코드
webSocket(server);
