// console.log(this); //global?
// console.log(this === module.exports); //exports === module.exports === {}

// //function 안의 this 만 global에 해당함!
// function a() {
//   console.log(this === global);
// }

// a();

//자바스크립트의 함수는 호출될 때, 매개 변수로 전달되는 인자값 이외에,
//arguments 객체와 this를 암묵적으로 전달 받는다.
function sqare(num) {
  console.log("arguments: ", arguments);
  console.log("this: ", this);

  return num * num;
}

console.log(sqare(2));
