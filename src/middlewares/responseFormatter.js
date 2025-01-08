// src/middleware/responseFormatter.js
const responseFormatter = (req, res, next) => {
	res.success = (message = "SUCCESS", data = null) => {
		const response = {
			status: {
				returnCode: "00",
				returnMessage: message,
			},
		};

		if (data) response.data = data;

		res.status(200).json(response);
	};

	res.error = (errorCode, errorMessageKey) => {
		res.status(200).json({
			status: {
				returnCode: errorCode,
				returnMessage: errorMessageKey,
			},
		});
	};

	next();
};

module.exports = responseFormatter;
