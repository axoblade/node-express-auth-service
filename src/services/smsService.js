const sendSMS = async (to, text) => {
	// Mock sms-sending functionality
	console.log(`Sending sms to: ${to}`);
	console.log(`Text: ${text}`);
};

module.exports = {
	sendSMS,
};
