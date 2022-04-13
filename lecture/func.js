//require()은 노드에서 제공하는 기본 함수
//destructuring으로 다른 파일에 있는 변수들을 가져와서 사용 가능!
const { odd, even } = require("./var");

function checkOddOrEven(number) {
  if (number % 2) {
    return odd;
  } else {
    return even;
  }
}

// console.log(checkOddOrEven(15));

//모듈.exports는 파일에서 한번만 사용 가능!
module.exports = checkOddOrEven;
