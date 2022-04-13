const path = require("path");

path.join(__dirname, "var.js");

//path.relative(a,b)
//a에서 b까지 가는 경로를 보여줌
console.log(
  "path.relative(): ",
  path.relative(
    "/Users/jasonkim/Documents/Github/nodeJsPrac/lecture/path.js",
    "/Users"
  )
);
