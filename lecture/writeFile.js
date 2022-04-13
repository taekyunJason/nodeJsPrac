//파일 시스템 이용하기
const fs = require("fs").promises;

//현재 경로에 writeme 파일을 만들기
fs.writeFile("./writeme.txt", "글이 입력됩니다.")
  .then(() => {
    return fs.readFile("./writeme.txt");
  })
  .then((data) => {
    console.log(data.toString());
  })
  .catch((err) => {
    throw err;
  });
