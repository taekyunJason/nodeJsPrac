const mongoose = require("mongoose");

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;
const chatSchema = new Schema({
  //방에 대한 오브젝트 id 저장
  //room의 ObjectId가 아니라 populate를 하면 room에 대한 오브젝트 정보로 치환해줌
  //이것을 위해 ref로 ObjectId를 'Room'으로 연결해 놓음
  room: {
    type: ObjectId,
    required: true,
    //몽구스가 populate로 두 정보를 합쳐줌
    ref: "Room",
  },
  //채팅 작성자
  user: {
    type: String,
    required: true,
  },
  //채팅, gif
  chat: String,
  gif: String,
  //작성일
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
