const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I do work", By: "© 2021 Copyright: GMayaS C:\>Desarrollo en Sistemas." }).status(200);
});

module.exports = router;