console.log(this); //global?
console.log(this === module.exports); //exports === module.exports === {}

//function 안의 this 만 global에 해당함!
function a() {
  console.log(this === global);
}

a();
