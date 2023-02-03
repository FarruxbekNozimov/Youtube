const jwt = require("jsonwebtoken");
const JWT_SECRET = "FarruxDEV";

const generateJWTtoken = (userId) => {
	const accessToken = jwt.sign({ userId }, JWT_SECRET, {
		expiresIn: "10d",
	});
	return accessToken;
};

module.exports = { generateJWTtoken };
