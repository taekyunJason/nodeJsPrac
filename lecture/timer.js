//4번
const timeout = setTimeout(() => {
  console.log("1.5초 후 실행");
}, 1500);

//3번 , 5번
const interval = setInterval(() => {
  console.log("1초마다 실행");
}, 1000);

const timeout2 = setTimeout(() => {
  console.log("실행되지 않습니다.");
}, 3000);

//6번
setTimeout(() => {
  clearTimeout(timeout2);
  clearInterval(interval);
}, 2500);

//1번
const immeditate = setImmediate(() => {
  console.log("즉시 실행");
});

//2번 생성후 바로 클리어
const immeditate2 = setImmediate(() => {
  console.log("실행되지 않습니다.");
});
clearImmediate(immeditate2);
