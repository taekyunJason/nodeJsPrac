const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { nextTick } = require("process");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");

const app = express();

//app.use로 미들웨어 사용
//미들웨어 사용에도 순서가 중요함!

//app에 관련된 설정
//서버에 변수 선언해주는 방법 => 이후에 app.get으로 사용가능!!
app.set("port", process.env.PORT || 3000);

//morgan("dev") - 요청방식, http상태코드, 시간등을 보여줌 / morgan("combined") - 사용자 ip, 시간, 요청방식, http상태코드, 시간등, 접속 브라우저까지 확인 가능
app.use(morgan("dev"));
app.use(cookieParser("mySecretKey"));

//중간에 static을 만났을때 요청한 파일이 실제로 있으면 다음 미들웨어로 넘어가지 않음
//파일을 전송하는데 쿠키/데이터 파싱할 필요가 없기때문에 상단에서 모건으로 사용자 정보를 보여주고 바로 작성하는 편이 좋음!
app.use("요청 경로", express.static(path.join(__dirname, "실제 경로")));
//ex) 요청:localhost:3000/main.html    실제: /public3030/main.html
//->이렇게 작성하면 보안에 좋음! 정적 파일을 제공하는 의미도 있지만, 사람들이 main.html을 요청할때 우리의 서버구조를 전혀 예측할수 없음.
//클라이언트에서는 우리 서버에 public3030이라는 폴더의 존재를 알 수 없음
//그래서 static을 사용하면 이와같은 정적파일(이미지,동영상,pdf)들을 모두 제공하면서, 요청경로/실제경로가 다르기때문에 보안에도 도움이 됨!
app.use("/", express.static(path.join(__dirname, "public")));

//알아서 데이터가 파싱됨 (거의 필수로 작성함!)
//클라이언트에서 json파일을 보냈을때, json데이터를 파싱해서 req.body에 넣어줌
app.use(express.json());
//클라이언트에서 form데이터를 보냈을때, form데이터를 파싱해서 req.body에 넣어줌
//만약 form데이터에서 이미지/파일을 보내는 경우, Urlencoded로 처리하지 못해서 multer라는 라이브러리 사용해야함!
app.use(express.urlencoded({ extended: true })); //extended => form을 파싱할때 쿼리스트링을 어떻게 처리할지에 대한 것. true이면 qs 모듈 사용, false이면 querystring 사용 (qs가 querystring보다 강력함)

app.use(session());
app.use(multer().array());

//공통미들웨어 추가
//라우터 추가
app.get("/", (req, res) => {
  //아래처럼 파싱된 데이터를 바로 뽑아서 사용가능!
  req.body.name;
  //cookie 관련 조작들이 편해짐!
  req.cookies; //{mycookie: 'test'} 이런식으로 알아서 파싱이 되어있음!
  //쿠키파서 미들웨어 사용시 안에 작성한 시크릿키로 쿠키를 서명함
  req.signedCookies;
  //쿠키에 대한 조작 가능
  res.cookie("name", encodeURIComponent(name), {
    expires: new Date(),
    httpOnly: true,
    path: "/",
  });
  //쿠키 삭제 가능
  res.clearCookie("name", encodeURIComponent(name), {
    httpOnly: true,
    path: "/",
  });

  // res.send('Hello, Express');
  res.sendFile(path.join(__dirname, "/index.html"));
});

//라우터는 순서대로 실행되기 때문에 와일드카드가 위에 있으면 아래에 라우터가 실행되지 않음! => 그래서 와일드카드는 항상 다른 라우터들보다 아래에서 실행되어야 의도한 결과를 얻음!
//라우트 매개변수(route parameter) = 여러 카테고리들이 존재할때 변하게 변수로 접근하는 경우에 유용
app.get("/category/:name", (req, res) => {
  res.send(`hello ${req.params.name}`); //req.params로 접근해서 name 값을 사용가능!
});

app.get("/category/javascript", (req, res) => {
  res.send(`hello JS`);
});

// * : 모든 get요청에 대해서 아래 코드로 처리하겠다는 라우터!
app.get(
  "*",
  (req, res, next) => {
    //console.log("1 hello world!");
    next();
  },
  (req, res, next) => {
    //console.log("2 hello world!");
    //next('route')는 아래의 미들웨어가 아닌 다음 라우터가 실행되도록 건너뜀
    next("route");
  },
  (req, res, next) => {
    try {
      console.log("에러야!");
    } catch (error) {
      //바로 에러처리 미들웨어로 넘어감
      next(error);
    }
  }
);

//404처리는 라우터 아래 && 에러처리 위에 작성해주면 됨! => 에러는 아님!
app.use((req, res, next) => {
  res.send("404처리 미들웨어 입니다!");
});

//에러처리 미들웨어
//인자를 4개 모두 작성해야함! => 인자 4개와 3개는 JS에서 아예 다른 함수로 인식함
//이렇게 에러처리를 하면 서버에서만 에러 내용이 보이고, 보안적으로 좋음
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("에러발생했어요!");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
