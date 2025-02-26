const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const responseFormatter = require("./middlewares/responseFormatter");

dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(responseFormatter);

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization"
	);
	next();
});

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/integration", integrationRoutes);

if (require.main === module) {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

module.exports = app;
