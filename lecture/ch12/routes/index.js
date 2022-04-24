const express = require("express");
const router = express.Router();

//index.html 라우팅
router.get("/", (req, res) => {
  res.render("main");
});

module.exports = router;
