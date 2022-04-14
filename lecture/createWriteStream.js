const fs = require("fs");

const WriteStream = fs.createWriteStream("./writeme2.txt");
WriteStream.on("finish", () => {
  console.log("파일 쓰기 완료");
});
WriteStream.write("이 글을 씁니다.\n");
WriteStream.write("한 번 더 씁니다.");
WriteStream.end();
