const prisma = require("../config/prisma");

const createStudent = async (req, res) => {
	try {
		req.body.createdby = req.user.id;

		if (req.body.dob) {
			req.body.dob = new Date(req.body.dob);
		} else {
			delete req.body.dob;
		}

		await prisma.student.create({
			data: req.body,
		});
		res.success("SUCCESS");
	} catch (error) {
		res.dbError(error);
	}
};

const filterStudents = async (req, res) => {
	try {
		const { page = 1, pageSize = 10, search } = req.query;

		const skip = (page - 1) * pageSize || 0;

		let filters = {};
		if (search !== undefined) {
			if (search !== "") {
				filters = {
					OR: [
						{ first_name: { contains: search } },
						{ middle_name: { contains: search } },
						{ last_name: { contains: search } },
					],
				};
			}
		}

		const students = await prisma.student.findMany({
			where: filters,
			orderBy: {
				createdAt: "desc",
			},
			skip: parseInt(skip),
			take: parseInt(pageSize),
		});

		const totalCount = await prisma.student.count({ where: filters });
		const totalPages = Math.ceil(totalCount / pageSize);

		res.success("SUCCESS", {
			pagination: {
				page: parseInt(page),
				pageSize: parseInt(pageSize),
				totalCount,
				totalPages,
				nextPage:
					parseInt(page) < parseInt(totalPages) ? parseInt(page) + 1 : 0,
				prevPage: parseInt(page) > 1 ? parseInt(page) - 1 : 0,
			},
			students,
		});
	} catch (error) {
		console.error("Error geting HIKE invoices:", error);
		res.error("500", "Internal server error");
	}
};

module.exports = {
	createStudent,
	filterStudents,
};
