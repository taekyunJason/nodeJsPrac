//node에서 비동기(순서대로 동작하지 않음) => 논블로킹, 동기(순서대로 동작) => 블로깅
//fs.readFile은 비동기로 실행되어서 순서 보장이 되지 않음
const fs = require("fs");

let data = fs.readFileSync("./readme.txt");
console.log("1번", data.toString());

data = fs.readFileSync("./readme.txt");
console.log("2번", data.toString());

data = fs.readFileSync("./readme.txt");
console.log("3번", data.toString());

data = fs.readFileSync("./readme.txt");
console.log("4번", data.toString());
