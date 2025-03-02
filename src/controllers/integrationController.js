const prisma = require("../config/prisma");
const { addUser } = require("../services/authService");

const addNewUser = async (req, res) => {
	try {
		const { email, name, phone, role, verificationUrl, password } = req.body;

		if (!email || !name || !phone || !role) {
			return res.error(400, "All fields are required");
		}

		if (!role.name) {
			return res.error(400, "Invalid role provided");
		}

		if (role?.permissions?.length < 0) {
			return res.error(400, "Insufficient permissions provided for the role");
		}

		const createdRole = await prisma.role.upsert({
			where: { name: role.name },
			update: {},
			create: {
				name: role.name,
			},
		});

		const createdPermissions = [];
		for (const permission of role?.permissions) {
			const existingPermission = await prisma.permission.findUnique({
				where: { name: permission.name },
			});
			if (!existingPermission) {
				const created = await prisma.permission.create({
					data: permission,
				});
				createdPermissions.push(created);
			} else {
				createdPermissions.push(existingPermission);
			}
		}

		for (const permission of createdPermissions) {
			await prisma.rolePermission.upsert({
				where: {
					roleId_permissionId: {
						roleId: createdRole.id,
						permissionId: permission.id,
					},
				},
				update: {},
				create: {
					roleId: createdRole.id,
					permissionId: permission.id,
				},
			});
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.error(400, "User already exists");
		}

		await addUser(
			email,
			name,
			phone,
			createdRole.id,
			verificationUrl,
			password
		);

		return res.success();
	} catch (error) {
		res.error(400, error.message);
	}
};

module.exports = {
	addNewUser,
};
