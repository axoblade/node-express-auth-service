const prisma = require("../config/prisma");

const getAllUsers = async () => {
	return prisma.user.findMany({
		select: {
			id: true,
			email: true,
			phone: true,
			isActive: true,
			emailVerified: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

const toggleUserStatus = async (userId, isActive) => {
	return prisma.user.update({
		where: { id: userId },
		data: { isActive },
	});
};

const deleteUser = async (userId) => {
	// Check if the user has any associated records
	const hasAssociatedRecords = await prisma.userRole.findFirst({
		where: { userId },
	});

	if (hasAssociatedRecords) {
		throw new Error(
			"User cannot be deleted because they have associated roles or records"
		);
	}

	return prisma.user.delete({
		where: { id: userId },
	});
};

module.exports = { getAllUsers, toggleUserStatus, deleteUser };
