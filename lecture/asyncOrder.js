//node에서 비동기(순서대로 동작하지 않음) => 논블로킹, 동기(순서대로 동작) => 블로깅
//fs.readFile은 비동기로 실행되어서 순서 보장이 되지 않음
const fs = require("fs");

//sync(동기)로 하는 작업과의 차이점?
//=> sync는 말그대로 동기로 실행이 되어서 sync파일이 10번 실행되면 40개의 작업이 실행되지만,
//asyncOrder파일을 10번 실행하면 4X10 으로 4개 짜리 한묶음 작업이 10개의 작업이 동시에 실행됨!
fs.readFile("./readme.txt", (err, data) => {
  if (err) {
    throw err;
  }
  console.log("1번", data.toString());
  fs.readFile("./readme.txt", (err, data) => {
    if (err) {
      throw err;
    }
    console.log("2번", data.toString());
    fs.readFile("./readme.txt", (err, data) => {
      if (err) {
        throw err;
      }
      console.log("3번", data.toString());
      fs.readFile("./readme.txt", (err, data) => {
        if (err) {
          throw err;
        }
        console.log("4번", data.toString());
      });
    });
  });
});
