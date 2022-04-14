const fs = require("fs");
const readStream = fs.createReadStream("./readme3.txt", { highWaterMark: 16 });
const data = [];

//stream은 비동기 처리 / 순서대로 데이터를 넘겨줌
//stream방식은 buffer방식에 비해 메모리를 아낄수 있음
//비동기는 에러처리가 필요함
readStream.on("data", (chunk) => {
  data.push(chunk);
  console.log("data: ", chunk, chunk.length);
});
readStream.on("end", () => {
  console.log("end:", Buffer.concat(data).toString());
});
readStream.on("error", (err) => {
  console.log("error:", err);
});
