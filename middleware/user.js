const jwt = require("jsonwebtoken");
const { jsonReader } = require("../utils/fileUtil");
const JWT_SECRET = "FarruxDEV";

module.exports = async function (req, res, next) {
	const users = jsonReader("users");
	const token = req.cookies.token;
	if (!token) {
		next();
		return;
	}

	const decode = jwt.verify(token, JWT_SECRET);
	let user = users.find((user) => user.id == decode.userId);
	req.user = user;
	req.userId = user ? user._id : null;
	next();
};
