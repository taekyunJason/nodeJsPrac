const http = require("http");
const fs = require("fs").promises;

//http 서버 작성도 비동기 이기 때문에 에러처리를 해주는 것이 좋음!
const server = http
  .createServer(async (req, res) => {
    try {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); //html이라는 것을 알려주는 속성
      const data = await fs.readFile("./server2.html");
      res.end(data);
    } catch (error) {
      console.log(error);
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }); //일반 문자열을 알려주는 속성
      res.end(err.message);
    }
  })
  .listen(8080);

server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기중입니다.");
});
server.on("error", (error) => {
  console.error(error);
});
