//구조분해 할당시 속셩 이름과 변수 이름을 똑같이 통일시켜야 함!
const { odd, even } = require("./var");
const checkNumber = require("./func");

function checkStringOddEven(str) {
  if (str.length % 2) {
    return odd;
  } else {
    return even;
  }
}

console.log(checkNumber(10));
console.log(checkStringOddEven("hello"));
