const path = require("path");

path.join(__dirname, "var.js");

console.log(
  "path.relative(): ",
  path.relative(
    "/Users/jasonkim/Documents/Github/nodeJsPrac/lecture/path.js",
    "/Users"
  )
);
