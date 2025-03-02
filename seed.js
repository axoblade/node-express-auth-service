const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

const seed = async () => {
	try {
		console.log("Seeding database...");

		// Create Permissions
		const adminEmail = process.env.ADMIN_EMAIL || "admin@email.com";
		const existingAdmin = await prisma.user.findUnique({
			where: { email: adminEmail },
		});

		if (!existingAdmin) {
			const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123";
			const hashedPassword = await bcrypt.hash(adminPassword, 10);
			await prisma.user.create({
				data: {
					email: adminEmail,
					first_name: "System",
					last_name: "Admin",
					phone: "256708379861",
					gender: "Male",
					password: hashedPassword,
					isActive: true,
					emailVerified: true,
					role: "admin",
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
