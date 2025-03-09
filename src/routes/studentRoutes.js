const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { createStudent } = require("../controllers/studentController");
const router = express.Router();

router.post("/add-student", authenticate, createStudent);

module.exports = router;
