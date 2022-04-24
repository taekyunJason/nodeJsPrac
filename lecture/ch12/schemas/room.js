const mongoose = require("mongoose");

const { Schema } = mongoose;
const roomSchema = new Schema({
  //방이름
  title: {
    type: String,
    required: true,
  },
  //인원 : 최소 2명 최대 10명
  max: {
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  //방장
  owner: {
    type: String,
    required: true,
  },
  //비밀번호 : 옵셔널
  password: String,
  //생성일자
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
