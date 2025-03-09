const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const {
	createStudent,
	filterStudents,
} = require("../controllers/studentController");
const router = express.Router();

router.post("/add-student", authenticate, createStudent);
router.get("/filter", authenticate, filterStudents);

module.exports = router;
