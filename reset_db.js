const { execSync } = require("child_process");
const mysql = require("mysql2/promise");
const prisma = require("./src/config/prisma");
const seed = require("./seed");

// Function to parse the DATABASE_URL
const parseDatabaseUrl = (url) => {
	const regex = /mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/;
	const match = regex.exec(url);

	if (!match) {
		throw new Error("Invalid DATABASE_URL format");
	}

	return {
		user: match[1],
		password: match[2],
		host: match[3],
		port: parseInt(match[4], 10),
		database: match[5],
	};
};

const resetDatabase = async () => {
	try {
		console.log("Resetting database...");

		// Parse DATABASE_URL
		const { user, password, host, port, database } = parseDatabaseUrl(
			process.env.DATABASE_URL
		);

		console.log("Connecting to MySQL database...");
		const connection = await mysql.createConnection({
			host,
			user,
			password,
			port,
		});

		console.log(`Dropping and recreating the database: ${database}...`);
		await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
		await connection.query(`CREATE DATABASE \`${database}\`;`);

		console.log("Database reset successfully.");

		// Push the Prisma schema
		console.log("Pushing Prisma schema to the database...");
		execSync("npx prisma db push", { stdio: "inherit" });

		// Seed the database
		console.log("Seeding the database...");
		await seed();

		console.log("Database reset complete!");
		process.exit(0);
	} catch (error) {
		console.error("Error resetting the database:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
};

resetDatabase();
