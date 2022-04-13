//파일 시스템 이용하기
const fs = require("fs").promises;

//파일 시스템은 콜백형식을 가지고 있음 fs.readFile('./readme.txt', (err, data)=>{}) 형태를 가지고 있음
fs.readFile("./readme.txt")
  .then((data) => {
    console.log("1번", data.toString());
    return fs.readFile("./readme.txt");
  })
  .then((data) => {
    console.log("2번", data.toString());
    return fs.readFile("./readme.txt");
  })
  .then((data) => {
    console.log("3번", data.toString());
    return fs.readFile("./readme.txt");
  })
  .then((data) => {
    console.log("4번", data.toString());
    return fs.readFile("./readme.txt");
  })
  .catch((err) => {
    throw err;
  });
