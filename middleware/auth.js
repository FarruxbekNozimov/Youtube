const jwt = require("jsonwebtoken");
const { jsonReader } = require("../utils/fileUtil");

module.exports = function (req, res, next) {
	if (!req.cookies.token) {
		res.redirect("/login");
		return;
	}
	let token = jwt.verify(req.cookies.token, "FarruxDEV");
	let users = jsonReader("users");
	for (let i in users) {
		if (users[i].id == token.userId) {
			return next();
		}
	}
	res.redirect("/login");
};
