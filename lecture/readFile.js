//파일 시스템 이용하기
const fs = require("fs").promises;

//파일 시스템은 콜백형식을 가지고 있음 fs.readFile('./readme.txt', (err, data)=>{}) 형태를 가지고 있음
fs.readFile("./readme.txt")
  .then((data) => {
    console.log(data);
    console.log(data.toString());
  })
  .catch((err) => {
    throw err;
  });
