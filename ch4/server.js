const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Tytpe": "text/html; charset=utf-8" });
    res.write("<h1>hello node!<h1>");
    res.end("<p>hello server<p>");
  })

  .listen(8080, () => {
    console.log("8080 번 포트에서 서버 대기중입니다.");
  });
