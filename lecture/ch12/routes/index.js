const express = require("express");

const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find({});
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
    const { rooms } = io.of("/chat").adapter; //io.of('/chat').adapter/rooms[방아이디]
    //
    //
    //방의 인원 구하기 = io.of("/chat").adapter.rooms[req.params.id].length
    //
    //
    //방의 최대인원보다 초과한 경우
    if (
      rooms &&
      rooms[req.params.id] &&
      room.max <= rooms[req.params.id].length
    ) {
      return res.redirect("/?error=허용 인원이 초과하였습니다.");
    }
    //모든 검사가 끝났을때 채팅방 그려주기
    return res.render("chat", {
      room,
      title: room.title,
      chats: [],
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

module.exports = router;
