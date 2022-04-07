//require()은 노드에서 제공하는 기본 함수
const { odd, even } = require("./var");

function checkOddOrEven(number) {
  if (number % 2) {
    return odd;
  } else {
    return even;
  }
}

console.log(checkOddOrEven(15));

//파일에서 한번만 사용 가능!
module.exports = checkOddOrEven;
