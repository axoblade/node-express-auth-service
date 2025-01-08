const { check, validationResult } = require("express-validator");

const validateLogin = [
	check("identifier").notEmpty().withMessage("Invalid username format"),
	check("password").notEmpty().withMessage("Password is required"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.error("400", "Validation failed", errors.array());
		}
		next();
	},
];

module.exports = { validateLogin };
