const mongoose = require("mongoose");

//.env 파일의 변수들을 비구조화 할당
const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
//아이디 패스워드로 몽고디비에 로그인
const MONGO_URL = `mongodb://localhost:27017/local`;

const connect = () => {
  //개발모드일때 몽고디비의 퀄이 무엇인지 보여줌
  if (NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  //몽고디비 연결부분
  mongoose.connect(
    MONGO_URL,
    {
      dbName: "gifchat",
      useNewUrlParser: true,
      // useCreateIndex: true,
    },
    (error) => {
      if (error) {
        console.log("몽고디비 연결 에러", error);
      } else {
        console.log("몽고디비 연결 성공");
      }
    }
  );
};

mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});
mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

module.exports = connect;
