const prisma = require("../config/prisma");

const createRole = async (name, permissions) => {
	const role = await prisma.role.create({
		data: {
			name,
			permissions: {
				create: permissions.map((permissionId) => ({ permissionId })),
			},
		},
	});

	return role;
};

const assignRoleToUser = async (userId, roleId) => {
	return prisma.userRole.create({
		data: { userId, roleId },
	});
};

const getRoles = async () => {
	return prisma.role.findMany({
		include: { permissions: { include: { permission: true } } },
	});
};

module.exports = {
	createRole,
	assignRoleToUser,
	getRoles,
};
