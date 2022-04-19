const { error } = require("console");
const http = require("http");

//http 서버 작성도 비동기 이기 때문에 에러처리를 해주는 것이 좋음!
const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html;" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server!</p>");
    res.end("<p>Hello jason</p>");
  })
  .listen(80);

server.on("listening", () => {
  console.log("8080번 포트에서 서버 대기중입니다.");
});
server.on("error", (error) => {
  console.error(error);
});
