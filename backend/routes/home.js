const express = require("express");
const router = express.Router();

const verifyUser = require("../middlewares/verifyUser");

router.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

module.exports = router;
