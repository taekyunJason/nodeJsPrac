const { exec } = require("child_process");

var process = exec("dir");

process.stdout.on("data", function (data) {
  console.log(data.toString());
});
