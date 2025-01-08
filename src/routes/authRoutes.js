const express = require("express");
const authenticate = require("../middlewares/authMiddleware");
const { validateLogin } = require("../middlewares/validateLogin");
const {
	registerUser,
	loginUser,
	verifyEmail,
	verifyLoginOtp,
	refreshToken,
	handlePasswordResetRequest,
	handleResetPassword,
	handleUpdateUserDetails,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyLoginOtp);
router.post("/refresh-token", refreshToken);
router.post("/request-password-reset", handlePasswordResetRequest);
router.post("/reset-password", handleResetPassword);
router.put("/update-user", authenticate, handleUpdateUserDetails);

module.exports = router;
