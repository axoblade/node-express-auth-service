const prisma = require("../config/prisma");

const createStudent = async (req, res) => {
	try {
		req.body.createdby = req.user.id;
	
		await prisma.student.create({
			data: req.body
		})
		res.success("SUCCESS");
	} catch (error) {
		console.log(error)
		res.error("400", error);
	}
};

module.exports = {
	createStudent,
};
