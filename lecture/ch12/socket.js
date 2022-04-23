// const SocketIO = require("socket.io");

// module.exports = (server, app) => {
//   const io = SocketIO(server, { path: "/socket.io" });
//   app.set("io", io); // req.app.get('io')
//   const room = io.of("/room");
//   const chat = io.of("/chat");

//   room.on("connection", (socket) => {
//     console.log("room 네임스페이스에 접속");
//     socket.on("disconnect", () => {
//       console.log("room 네임스페이스 접속 해제");
//     });
//   });

//   chat.on("connection", (socket) => {
//     console.log("chat 네임스페이스에 접속");
//     const req = socket.request;
//     const {
//       headers: { referer },
//     } = req;
//     const roomId = referer
//       .split("/")
//       [referer.split("/").length - 1].replace(/\?.+/, "");
//     socket.join(roomId);

//     socket.on("disconnect", () => {
//       console.log("chat 네임스페이스 접속 해제");
//       socket.leave(roomId);
//     });
//   });
// };

//
//
//
//
//

//프론트에서 서버쪽 웹소켓에 연결을 시도할때 받아줄 파일
const WebSocket = require("ws");

//아래 함수로 웹소켓 서버를 Websocket의 객체에 담아서 exports!
module.exports = (server) => {
  //웹소켓 서버를 wss 변수에 할당
  const wss = new WebSocket.Server({ server });

  // 웹소켓 연결 시
  //아래 콜백은 프론트에서 서버 웹소켓에 연결을 시도할때 실행됨

  //connection과 close로 웹소켓의 접속이 되었는지 끊어졌는지 확인할 수 있음!
  wss.on("connection", (ws, req) => {
    //클라 =>서버로 요청올때 ip 파악을 먼저 진행
    //프록시 서버를 통해서 ip가 변조된 것을 catch하기 위해서 req.headers["x-forwarded-for"] 사용
    //하지만 ip는 언제든지 변조가 가능하기때문에 100% 정확하게 잡아낸다고 생각하면 안됨
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("새로운 클라이언트 접속", ip);

    // 클라이언트로부터 메시지를 보낸 경우(webSocket.send())의 이벤트 리스너
    //webSocket.send() 안의 메시지 내용이 아래 콜백의 message에 담겨있음
    ws.on("message", (message) => {
      console.log(message.toString());
    });

    // 에러 처리 핸들러
    ws.on("error", (error) => {
      console.error(error);
    });

    // 연결 종료 시 - 클라이언트에서 브라우저를 종료한 경우 등
    ws.on("close", () => {
      console.log("클라이언트 접속 해제", ip);
      //연결 종료시 서버에서 클라이언트로 메시지를 보내는 코드를 중지함
      clearInterval(ws.interval);
    });

    // 3초마다 클라이언트로 메시지 전송
    //속성으로 interval id를 저장해서 위에서 연결이 종료되었을때 클라이언트로 메시지를 보내는 것도 종료하도록 하는 코드
    ws.interval = setInterval(() => {
      //웹소켓 연결은 모두 비동기로 실행되기 때문에 웹소켓의 상태가 연결된 상태일때만 클라이언트로 메시지를 보내도록 안전장치의 역할을 하는 코드
      if (ws.readyState === ws.OPEN) {
        //클라이언트로 메시지를 보내는 코드
        ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
      }
    }, 3000);
  });
};

//프로세스
//먼저 서버에서 연결이 되었을때 we.send로 클라이언트에 메시지를 보내면
//클라이언트 index.html의 onmessage가 실행되어서 클라이언트에서 서버의 메시지가 찍히고
//바로 아래에서 webSocket.send가 실행되어서 서버로 메시지를 보냄
//그러면 다시 서버의 ws.on이 실행되어서 클라이언트에서 보내준 메시지를 찍어줌
