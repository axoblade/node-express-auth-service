const prisma = require("prisma");

const createStudent = async (req, res) => {
	try {
		res.success("SUCCESS");
	} catch (error) {
		res.error("400", "Internal Server Error");
	}
};

module.exports = {
	createStudent,
};
