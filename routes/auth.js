const { Router } = require("express");
const { jsonReader, jsonWriter } = require("../utils/fileUtil");
// const { downloadImg } = require("../utils/uploader");
const router = Router();
const path = require("path");
const { generateJWTtoken } = require("../utils/token");

router.get("/register", (req, res) => {
	req.cookies.token && res.redirect("/");
	res.render("register", { form: true });
});

router.post("/register", (req, res) => {
	const { username, password } = req.body;
	let users = jsonReader("users");
	console.log(req.files, username, password);
	if (!req.files || !username || !password) {
		return res.render("register", {
			form: true,
			error: "All fields are required",
		});
	}
	const { file } = req.files;
	for (let i in users) {
		if (users[i].username == username) {
			return res.render("register", {
				form: true,
				error: "This User is already registered",
			});
		}
	}
	if (password.length < 6) {
		return res.render("register", {
			form: true,
			error: "Password is too short",
		});
	}
	const user = {
		id: "id-" + new Date().getTime(),
		userId: req.user,
		username,
		password,
		avatar: Date.now() + ".png",
	};
	file.mv(path.join(__dirname, "..", "public", "avatars", user.avatar));
	users.push(user);
	jsonWriter("users", users);
	res.redirect("/login");
});

router.get("/login", (req, res) => {
	req.cookies.token && res.redirect("/");
	res.render("login", { form: true });
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	let users = jsonReader("users");
	console.log(username, password);
	for (let i in users) {
		if (users[i].username == username) {
			if (users[i].password != password) {
				return res.render("login", {
					form: true,
					error: "Password is wrong",
				});
			}
			const token = generateJWTtoken(users[i].id);
			res.cookie("token", token, { httpOnly: true, secure: true });
			res.redirect("/");
		}
	}
	return res.render("login", {
		form: true,
		error: "User not found",
	});
});

module.exports = router;
