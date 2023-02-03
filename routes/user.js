const { Router } = require("express");
const router = Router();
const AuthMiddleware = require("../middleware/auth.js");
const { jsonReader } = require("../utils/fileUtil.js");

router.get("/", AuthMiddleware, (req, res) => {
	let users = jsonReader("users");
	let posts = jsonReader("posts");
	for (let i in posts) {
		for (let j in users) {
			if (posts[i].userId == users[j].id) {
				posts[i].user = users[j];
				break;
			}
		}
	}
	console.log(posts);
	res.render("index", {
		currentUser: req.user,
		users,
		posts,
	});
});

router.get("/", AuthMiddleware, (req, res) => {
	let users = jsonReader("users");
	let posts = jsonReader("posts");
	res.render("index", {
		currentUser: req.user,
		users,
		posts,
	});
});

module.exports = router;
