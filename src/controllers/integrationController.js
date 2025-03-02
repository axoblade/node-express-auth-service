const prisma = require("../config/prisma");
const { addUser } = require("../services/authService");

const addNewUser = async (req, res) => {
	try {
		const {
			email,
			phone,
			role,
			password,
			first_name,
			last_name,
			middle_name,
			initials,
			address,
			salary,
			utility,
			gender,
			name_of_bank,
			account_number,
			mobile_money_number,
			registered_name,
			staff_photo,
			section,
			hasAccess,
		} = req.body;

		if (!email || !phone || !role) {
			return res.error(400, "All fields are required");
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.error(400, "User already exists");
		}

		await addUser(
			email,
			phone,
			role,
			password,
			first_name,
			last_name,
			middle_name,
			initials,
			address,
			salary,
			utility,
			gender,
			name_of_bank,
			account_number,
			mobile_money_number,
			registered_name,
			staff_photo,
			section,
			hasAccess
		);

		return res.success();
	} catch (error) {
		console.log(error);
		res.error(400, "Internal server error");
	}
};

module.exports = {
	addNewUser,
};
