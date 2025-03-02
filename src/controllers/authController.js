const {
	register,
	login,
	verifyEmailToken,
	generateOtp,
	verifyOtp,
	generateAccessToken,
	requestPasswordReset,
	requestPasswordResetOTP,
	resetPassword,
	updateUserDetails,
} = require("../services/authService");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");

const registerUser = async (req, res) => {
	try {
		const { email, password, name, phone } = req.body;

		if (!email || !password || !name || !phone) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const user = await register(email, password, name, phone);
		res.status(201).json({ message: "User registered successfully", user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.body;

		if (!token) {
			return res.status(400).json({ error: "Token is required" });
		}

		const user = await verifyEmailToken(token);
		res.status(200).json({ message: "Email verified successfully", user });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const { identifier, password } = req.body;

		// Validate input
		if (!identifier || !password) {
			return res.error("400", "Identifier and password are required");
		}

		// Attempt login through the login service
		const _user = await login(identifier, password);

		// Generate and store OTP
		const otp = await generateOtp(_user.id);

		// Send OTP via email or SMS
		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
		if (isEmail) {
			await sendEmail(
				_user.email,
				`Your Login OTP Code`,
				`Your OTP is: ${otp}`
			);
		} else {
			await sendSMS(_user.phone, `Your Login OTP is: ${otp}`);
		}

		// Use success middleware
		/**return res.success(
			`Login successful, OTP sent via ${isEmail ? "email" : "SMS"}`,
			{
				name: user.name,
				userId: user.id,
				requires2FA: true,
			}
		);**/
		const { accessToken, refreshToken, user } = await verifyOtp(_user.id, otp);

		return res.success("OTP verified successfully", {
			accessToken,
			refreshToken,
			expiresIn: 3600, // Access token expiry in seconds
			user,
		});
	} catch (error) {
		console.error("Error during login:", error);

		// Determine appropriate error response
		const status =
			error.message === "User not found"
				? "404"
				: error.message === "Email not verified"
				? "403"
				: error.message === "Invalid credentials"
				? "401"
				: "500";

		return res.error(status, error.message || "Internal Server Error");
	}
};

const verifyLoginOtp = async (req, res) => {
	try {
		const { userId, otp } = req.body;

		if (!userId || !otp) {
			return res.error("400", "User ID and OTP are required");
		}

		const { accessToken, refreshToken, roles, permissions, name } =
			await verifyOtp(userId, otp);

		return res.success("OTP verified successfully", {
			accessToken,
			refreshToken,
			expiresIn: 3600, // Access token expiry in seconds
			user: {
				id: userId,
				name,
				roles,
				permissions,
			},
		});
	} catch (error) {
		console.error("Error verifying OTP:", error);
		return res.error("400", "Invalid or expired OTP");
	}
};

const refreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			return res.error("400", "Refresh token is required");
		}

		// Verify the refresh token
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

		// Generate a new access token
		const newAccessToken = await generateAccessToken(decoded.id);

		return res.success("Token refreshed successfully", {
			accessToken: newAccessToken,
			expiresIn: 3600,
		});
	} catch (error) {
		console.error("Error refreshing token:", error);

		const message =
			error.name === "TokenExpiredError"
				? "Refresh token has expired"
				: "Invalid or malformed refresh token";

		return res.error("401", message);
	}
};

const handlePasswordResetRequest = async (req, res) => {
	try {
		const { identifier, baseUrl } = req.body;

		let response;

		const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
		if (isEmail) {
			response = await requestPasswordReset(identifier, baseUrl);
		} else {
			response = await requestPasswordResetOTP(identifier);
		}

		return res.success(response);
	} catch (error) {
		console.log(error);
		return res.error("400", "Invalid username provided!");
	}
};

const handleResetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;
		const response = await resetPassword(token, newPassword);
		return res.success(response);
	} catch (error) {
		//console.log(error);
		return res.error("400", "Invalid or expired token provided!");
	}
};

const handleUpdateUserDetails = async (req, res) => {
	try {
		const userId = req.user.id; // Assuming `req.user` contains authenticated user info
		const updates = req.body;

		delete req.body?.password;

		const updatedUser = await updateUserDetails(userId, updates);

		res.status(200).json({
			message: "User details updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	verifyEmail,
	verifyLoginOtp,
	handlePasswordResetRequest,
	handleResetPassword,
	handleUpdateUserDetails,
	refreshToken,
};
