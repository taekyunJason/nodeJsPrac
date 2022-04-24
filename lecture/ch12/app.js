//socket.io 채팅방 실습
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const ColorHash = require("color-hash").default;

dotenv.config();
const webSocket = require("./socket");
const indexRouter = require("./routes");
const connect = require("./schemas");

const app = express();
app.set("port", process.env.PORT || 8005);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
//서버 실행되면서 몽고디비 바로 연결
connect();

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

//특정 사용자가 같은 사용자라는 것을 구분하기 위해 방안에서 같은 컬러로 표시
app.use((req, res, next) => {
  //특정한 사람한테
  if (!req.session.color) {
    //컬러해시를 부여해서
    const colorHash = new ColorHash();
    //세션에 저장해두고, 세션이 끝나기 전까지 그사람은 req.session.color에 고유한 색상이 남아있음
    //그리고 종료했다가 다시 시작하면 세션이 종료되어서 새로운 색깔이 부여됨
    //컬러를 부여하는 것은 고유한 req.sessionID값을 받아와서 고유값을 랜덤한 컬러로 변환
    req.session.color = colorHash.hex(req.sessionID);
  }
  next();
});

app.use("/", indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const server = app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

//socket.js파일에 server와 app을 매개변수로 같이 넘겨줌
//socket.js에서 라우터와 socket.io를 연결해야하기 때문!
webSocket(server, app);

//
//
//
//

// const express = require("express");
// const path = require("path");
// const morgan = require("morgan");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const nunjucks = require("nunjucks");
// const dotenv = require("dotenv");

// //프로세스 env 적용하기
// dotenv.config();
// //socket.js에서 웹소켓을 불러와서
// const webSocket = require("./socket");
// const indexRouter = require("./routes");

// const app = express();
// app.set("port", process.env.PORT || 8005);
// app.set("view engine", "html");
// nunjucks.configure("views", {
//   express: app,
//   watch: true,
// });

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

// app.use("/", indexRouter);

// //404 미들웨어
// app.use((req, res, next) => {
//   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
//   error.status = 404;
//   next(error);
// });

// //에러처리 미들웨어
// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
//   res.status(err.status || 500);
//   res.render("error");
// });

// //express 서버를 server변수에 담아서 아래에서 연결!
// const server = app.listen(app.get("port"), () => {
//   console.log(app.get("port"), "번 포트에서 대기중");
// });

// //socket.js에서의 웹소켓 서버와 express 서버를 연결해주는 코드
// webSocket(server);
