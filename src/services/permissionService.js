const prisma = require("../config/prisma");

const createPermission = async (name, description) => {
	const existingPermission = await prisma.permission.findUnique({
		where: { name },
	});

	if (existingPermission) {
		throw new Error("Permission name must be unique");
	}

	return prisma.permission.create({
		data: { name, description },
	});
};

const getAllPermissions = async () => {
	return prisma.permission.findMany();
};

const updatePermission = async (id, updates) => {
	return prisma.permission.update({
		where: { id },
		data: updates,
	});
};

const deletePermission = async (id) => {
	return prisma.permission.delete({
		where: { id },
	});
};

module.exports = {
	createPermission,
	getAllPermissions,
	updatePermission,
	deletePermission,
};
