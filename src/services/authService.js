const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { sendVerificationEmail, sendEmail } = require("./emailService");
const { sendSMS } = require("./smsService");

const register = async (email, password, name, phone) => {
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("User already exists");
	}

	const existingUserByPhone = await prisma.user.findUnique({
		where: { phone },
	});
	if (existingUserByPhone) {
		throw new Error("User already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			phone,
			name,
			isActive: true,
			emailVerified: false,
		},
	});

	const token = await generateEmailVerificationToken(user.id);

	await sendVerificationEmail(email, token);
	await sendSMS(phone, `Your Verification Token is: ${token}`);

	return user;
};

const generateEmailVerificationToken = async (userId) => {
	// Generate a unique token
	/**const token = crypto.randomBytes(32).toString("hex");
	const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token valid for 1 hour

	// Save the token in the database
	await prisma.emailVerificationToken.create({
		data: {
			userId,
			token,
			expiresAt,
		},
	});**/
	const token = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
	const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

	await prisma.emailVerificationToken.create({
		data: {
			userId,
			token,
			expiresAt,
		},
	});

	return token;
};

const verifyEmailToken = async (token) => {
	/** Find the token in the database**/
	const verificationToken = await prisma.emailVerificationToken.findUnique({
		where: { token },
		include: { user: true },
	});

	if (!verificationToken || verificationToken.expiresAt < new Date()) {
		throw new Error("Invalid or expired token");
	}

	// Update the user's emailVerified field
	await prisma.user.update({
		where: { id: verificationToken.userId },
		data: { emailVerified: true },
	});

	// Delete the token after successful verification
	await prisma.emailVerificationToken.delete({ where: { token } });

	return verificationToken.user;
};

const login = async (identifier, password) => {
	// Determine if the identifier is email or phone
	const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

	// Find the user based on email or phone
	const user = await prisma.user.findUnique({
		where: isEmail ? { email: identifier } : { phone: identifier },
	});

	if (!user) {
		throw new Error("User not found");
	}

	// Check if the email is verified for email-based login
	if (isEmail && !user.emailVerified) {
		throw new Error("Email not verified");
	}

	// Verify the password
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error("Invalid credentials");
	}

	return user;
};

const generateOtp = async (userId) => {
	const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
	const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

	// Update user record with OTP and expiry
	await prisma.user.update({
		where: { id: userId },
		data: { otp, otpExpiresAt },
	});

	return otp;
};

const verifyOtp = async (userId, otp) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
		throw new Error("Invalid or expired OTP");
	}

	// Clear OTP after successful verification
	await prisma.user.update({
		where: { id: userId },
		data: { otp: null, otpExpiresAt: null },
	});

	// Fetch roles and associated permissions
	const rolesWithPermissions = await prisma.userRole.findMany({
		where: { userId },
		include: {
			role: {
				include: {
					permissions: {
						include: {
							permission: true,
						},
					},
				},
			},
		},
	});

	const roles = rolesWithPermissions.map((roleWithPerm) => ({
		role_name: roleWithPerm.role.name,
		permissions: roleWithPerm.role.permissions.map((rp) => rp.permission.name),
	}));

	const permissions = roles.flatMap((role) => role.permissions);

	// Generate tokens
	const accessToken = await generateAccessToken(userId);

	const refreshToken = jwt.sign(
		{
			id: user.id,
			email: user.email,
		},
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: "7d" } // Refresh token expires in 7 days
	);

	const name = user.name;

	return { accessToken, refreshToken, roles, permissions, name };
};

const generateAccessToken = async (userId) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		throw new Error("User not found");
	}

	// Fetch roles and associated permissions
	const rolesWithPermissions = await prisma.userRole.findMany({
		where: { userId },
		include: {
			role: {
				include: {
					permissions: {
						include: {
							permission: true,
						},
					},
				},
			},
		},
	});

	const roles = rolesWithPermissions.map((roleWithPerm) => ({
		role_name: roleWithPerm.role.name,
		permissions: roleWithPerm.role.permissions.map((rp) => rp.permission.name),
	}));

	const permissions = roles.flatMap((role) => role.permissions);

	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			isActive: user.isActive,
			roles,
			permissions,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "1h" } // Access token expires in 1 hour
	);
};

const requestPasswordReset = async (email, frontendUrl = null) => {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		throw new Error("User not found");
	}

	const token = crypto.randomBytes(32).toString("hex");
	const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Token valid for 30 minutes

	await prisma.passwordResetToken.create({
		data: { token, userId: user.id, expiresAt },
	});

	// Send the password reset email
	await sendEmail(
		user.email,
		"Password Reset Request",
		`Your password reset link: <a href="${frontendUrl}/reset-password?token=${token}"> ${frontendUrl}/reset-password?token=${token}</a>`
	);

	return "Password reset email sent";
};

const requestPasswordResetOTP = async (phone) => {
	const user = await prisma.user.findUnique({ where: { phone } });
	if (!user) {
		throw new Error("User not found");
	}

	const token = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
	const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Token valid for 30 minutes

	await prisma.passwordResetToken.create({
		data: { token, userId: user.id, expiresAt },
	});

	// Send the password reset email
	await sendSMS(user.phone, `Your password reset otp is ${token}`);

	return "Password reset sms sent";
};

const resetPassword = async (token, newPassword) => {
	const resetToken = await prisma.passwordResetToken.findUnique({
		where: { token },
		include: { user: true },
	});

	if (!resetToken || resetToken.expiresAt < new Date()) {
		throw new Error("Invalid or expired token");
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);

	await prisma.user.update({
		where: { id: resetToken.userId },
		data: { password: hashedPassword, emailVerified: true },
	});

	// Delete the token after successful password reset
	await prisma.passwordResetToken.delete({ where: { token } });

	return "Password reset successfully";
};

const updateUserDetails = async (userId, updates) => {
	const { email, ...otherUpdates } = updates;

	// Check if the email is being updated and is unique
	if (email) {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser && existingUser.id !== userId) {
			throw new Error("Email is already in use");
		}
	}

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: {
			...otherUpdates,
			email,
		},
	});

	return updatedUser;
};

module.exports = {
	register,
	login,
	generateEmailVerificationToken,
	verifyEmailToken,
	generateOtp,
	verifyOtp,
	requestPasswordReset,
	requestPasswordResetOTP,
	resetPassword,
	updateUserDetails,
	generateAccessToken,
};
