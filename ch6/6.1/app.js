const express = require("express");
const path = require("path");
const { nextTick } = require("process");

const app = express();

//app에 관련된 설정
//서버에 변수 선언해주는 방법 => 이후에 app.get으로 사용가능!!
app.set("port", process.env.PORT || 3000);

//공통미들웨어 추가

//라우터 추가
app.get("/", (req, res) => {
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
    console.log("1 hello world!");
    next();
  },
  (req, res, next) => {
    console.log("2 hello world!");
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
