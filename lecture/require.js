require("./var"); //다른 파일을 실행시키긴 하지만 해당 파일에서 모듈로 익스포트한 변수는 사용할수 없음
console.log(require); //require.main으로 어떤 파일을 실행한건지 알아낼수 있음
