const express = require("express");
const { addNewUser } = require("../controllers/integrationController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add-user", authenticate, addNewUser);

module.exports = router;
