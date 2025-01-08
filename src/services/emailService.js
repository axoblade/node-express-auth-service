const sendEmail = async (to, subject, body) => {
	// Mock email-sending functionality
	console.log(`Sending email to: ${to}`);
	console.log(`Subject: ${subject}`);
	console.log(`Body: ${body}`);
};

const sendVerificationEmail = async (email, token) => {
	const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
	const subject = "Verify Your Email Address";
	const body = `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

	await sendEmail(email, subject, body);
};

module.exports = {
	sendEmail,
	sendVerificationEmail,
};
