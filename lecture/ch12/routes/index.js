const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    //방목록을 가져와서
    const rooms = await Room.find({});
    //방목록을 넣어줌!
    res.render("main", { rooms, title: "GIF 채팅방" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room", (req, res) => {
  res.render("room", { title: "GIF 채팅방 생성" });
});

router.post("/room", async (req, res, next) => {
  try {
    //새로운 방을 생성
    const newRoom = await Room.create({
      title: req.body.title,
      max: req.body.max,
      //사용자가 익명이라서 방장은 색깔로 구별됨, 따로 ID가 있는 것이 아님
      owner: req.session.color,
      password: req.body.password,
    });
    //socket.js에서 app.set(io)를 라우터와 연결해서 여기서 app.get(io)로 연결가능!
    const io = req.app.get("io");
    //room이라는 네임스페이스에 있는 사용자 모두에게 새로운 방이 생기면 새 방에 대한 정보를 알려줌
    //서버의 역할은 데이터를 프론트로 내려주는 것에서 끝남
    io.of("/room").emit("newRoom", newRoom);
    //방을 생성했으면 방으로 이동해서 입장도 진행시킴
    //비밀번호가 설정되어 있다면 비밀방, 없다면 공개방
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room/:id", async (req, res, next) => {
  try {
    //생성된 방이 실제로 존재하는지 찾아오기
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get("io");
    //방이 없는 경우
    if (!room) {
      return res.redirect("/?error=존재하지 않는 방입니다.");
    }
    //방의 비밀번호와 다른경우
    if (room.password && room.password !== req.query.password) {
      return res.redirect("/?error=비밀번호가 틀렸습니다.");
    }
    //io.of(/chat).adapter.rooms 안에 방 목록들이 들어있음
    //여기서 req.params.id로 방의 아이디를 가져오고,
    //rooms.id로 접근하면 해당 id를 가지는 방에 들어있는 사용자를 나타냄
    //io.of('/chat').adapter/rooms[방아이디]
    //방의 인원 구하기 = io.of("/chat").adapter.rooms[req.params.id].length
    const { rooms } = io.of("/chat").adapter;
    console.log(io.of("/chat").adapter.rooms[req.params.id]);

    //방의 최대인원보다 초과한 경우
    if (
      rooms &&
      rooms[req.params.id] &&
      room.max <= rooms[req.params.id].length
    ) {
      return res.redirect("/?error=허용 인원이 초과하였습니다.");
    }
    //모든 검사가 끝났을때 채팅방 그려주기
    const chats = await Chat.find({ room: room._id }).sort("createdAt");
    return res.render("chat", {
      room,
      title: room.title,
      chats,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.delete("/room/:id", async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send("ok");
    //이렇게 한번더 실행해줘도 괜찮음
    //방 목록을 보고있는 사람들에게는 지워진 방의 id를 통해 제거하고 알려주고
    req.app.get("io").of("/room").emit("removeRoom", req.params.id);

    //setTimeout으로 감싼 이유는 마지막으로 방에서 나가는 사람에게는 아래의 알림이 전달되지 않음.
    //방에 마지막으로 남아있는 사람은 chat네임스페이스에 존재함.
    //그래서 나가면 방에서 마지막으로 나온 사용자에게는 알림이 전달되지 않아서 2초 후에 전달을 해서
    //마지막으로 나온 사람도 알림을 받을 수 있게 함
    //마지막으로 방을 나간 사람에게는 시간을 두고 방이 제거된 것을 알려줌
    setTimeout(() => {
      //room 네임스페이스에 있는 사용자들에게 방이 삭제됨을 알려줌
      req.app.get("io").of("/room").emit("removeRoom", req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/room/:id/chat", async (req, res, next) => {
  //새로고침을 하면 대화내용이 모두 왼쪽 정렬되는 이유 - 서버를 재시작하기 때문
  //서버가 유지되는 한 같은 사람이 유지되는데, 서버를 재시작하면 세션 메모리가 날아가서
  //기존 사용자가 아니라 새로운 사용자로 등록이 되기 때문!
  //자신의 정보가 날아가버리기 때문!
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    //req.app.get("io").to(socket.id).emit("chat", chat); => 일대일대화
    //어떤 네임스페이스 안에서          /방 아이디까지 지정하고/채팅을 emit 하면 해당 방에 있는 사람들에게만 채팅전달
    //req.app.get("io").of("/chat").emit("chat", chat); 네임스페이스에 전체메시지 전달
    //req.app.get("io").emit("chat", chat); 나포함 전체 메시지 전달
    //req.app.get("io").broadcast.emit("chat", chat); 나를 제외한 나머지에게 전달
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

try {
  //uploads 폴더가 없으면 'uploads'폴더 만들기
  fs.readdirSync("uploads");
} catch (err) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

//multer 설정하는 부분
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  //파일 용량 - 5mb 제한
  limits: { fileSize: 5 * 1024 * 1024 },
});

//gif는 하나씩 업로드 하도록 설정
router.post("/room/:id/gif", upload.single("gif"), async (req, res, next) => {
  try {
    //chat이라는 객체를 프론트로 보내주었을때
    //chat 속성이 있으면 div태그로 생성
    //gif 속성이 있으면 img태그로 생성
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      //chat 대신에 파일명으로 파일이 저장된 위치에 업로드
      gif: req.file.filename,
    });
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
