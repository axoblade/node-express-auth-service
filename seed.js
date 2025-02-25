const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

const seed = async () => {
	try {
		console.log("Seeding database...");

		// Create Permissions
		const permissions = [
			{ name: "view_users", description: "Permission to view users" },
			{ name: "manage_users", description: "Permission to manage users" },
			{ name: "view_roles", description: "Permission to view roles" },
			{ name: "manage_roles", description: "Permission to manage roles" },
			{ name: "view_tags", description: "Permission to view tags" },
			{ name: "manage_tags", description: "Permission to manage tags" },
			{
				name: "manage_permissions",
				description: "Permission to manage permissions",
			},
			{
				name: "view_permissions",
				description: "Permission to view permissions",
			},
		];

		const createdPermissions = [];
		for (const permission of permissions) {
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

		console.log("Created permissions:", createdPermissions);

		// Create Tag
		const adminTag = await prisma.tag.upsert({
			where: { name: "Admin Tag" },
			update: {},
			create: { name: "Admin Tag" },
		});

		console.log("Created tag:", adminTag);

		// Create System Admin Role
		const adminRole = await prisma.role.upsert({
			where: { name: "System Admin" },
			update: {},
			create: {
				name: "System Admin",
			},
		});

		console.log("Created system admin role:", adminRole);

		// Associate Permissions with System Admin Role
		for (const permission of createdPermissions) {
			await prisma.rolePermission.upsert({
				where: {
					roleId_permissionId: {
						roleId: adminRole.id,
						permissionId: permission.id,
					},
				},
				update: {},
				create: {
					roleId: adminRole.id,
					permissionId: permission.id,
				},
			});
		}

		console.log("Associated permissions with System Admin role.");

		// Associate Tag with System Admin Role
		await prisma.roleTag.upsert({
			where: {
				roleId_tagId: {
					roleId: adminRole.id,
					tagId: adminTag.id,
				},
			},
			update: {},
			create: {
				roleId: adminRole.id,
				tagId: adminTag.id,
			},
		});

		console.log("Associated Admin Tag with System Admin role.");

		// Create System Admin User
		const adminEmail = process.env.ADMIN_EMAIL || "admin@email.com";
		const existingAdmin = await prisma.user.findUnique({
			where: { email: adminEmail },
		});

		if (!existingAdmin) {
			const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123";
			const hashedPassword = await bcrypt.hash(adminPassword, 10);
			const adminUser = await prisma.user.create({
				data: {
					email: adminEmail,
					name: "System Admin",
					phone: "256708379861",
					password: hashedPassword,
					isActive: true,
					emailVerified: true,
					roles: {
						create: {
							roleId: adminRole.id,
						},
					},
				},
			});

			console.log("System Admin created:", adminUser);

			// Associate Tag with System Admin User
			await prisma.userTag.upsert({
				where: {
					userId_tagId: {
						userId: adminUser.id,
						tagId: adminTag.id,
					},
				},
				update: {},
				create: {
					userId: adminUser.id,
					tagId: adminTag.id,
				},
			});

			console.log("Associated Admin Tag with System Admin user.");
		} else {
			console.log("System Admin already exists.");
		}

		console.log("Seeding completed.");
	} catch (error) {
		console.error("Error seeding database:", error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};

if (require.main === module) {
	seed().catch((error) => process.exit(1));
}

module.exports = seed;
