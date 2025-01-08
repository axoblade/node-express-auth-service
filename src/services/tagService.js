const prisma = require("../config/prisma");

const createTag = async (name) => {
	return prisma.tag.create({
		data: { name },
	});
};

const assignTagToUser = async (userId, tagId) => {
	return prisma.user.update({
		where: { id: userId },
		data: {
			Tag: { connect: { id: tagId } },
		},
	});
};

const assignTagToRole = async (roleId, tagId) => {
	return prisma.role.update({
		where: { id: roleId },
		data: {
			Tag: { connect: { id: tagId } },
		},
	});
};

const getAllTags = async () => {
	return prisma.tag.findMany({
		select: {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};

module.exports = { createTag, assignTagToUser, assignTagToRole, getAllTags };
