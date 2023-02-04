const { Router } = require("express");
const router = Router();
const AuthMiddleware = require("../middleware/auth.js");
const { jsonReader, jsonWriter } = require("../utils/fileUtil.js");
const path = require("path");
const { getVideoDurationInSeconds } = require("get-video-duration");

router.get("/", AuthMiddleware, (req, res) => {
	let users = jsonReader("users");
	let posts = jsonReader("posts");
	posts = req.query.search
		? posts.filter((p) =>
				p.title.toLowerCase().includes(req.query.search.toLowerCase())
		  )
		: posts;
	posts = posts.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
	for (let i in posts) {
		for (let j in users) {
			if (posts[i].userId == users[j].id) {
				posts[i].user = users[j];
				break;
			}
		}
	}
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

router.get("/admin", AuthMiddleware, (req, res) => {
	let users = jsonReader("users");
	let posts = jsonReader("posts");
	let userPosts = posts.filter((p) => p.userId == req.user.id);
	for (let i in posts) {
		for (let j in users) {
			if (posts[i].userId == users[j].id) {
				posts[i].user = users[j];
				break;
			}
		}
	}
	res.render("admin", {
		currentUser: req.user,
		users,
		posts,
		userPosts,
	});
});

router.post("/add", AuthMiddleware, (req, res) => {
	const { title } = req.body;
	let posts = jsonReader("posts");
	const { file } = req.files;
	const post = {
		id: "id-" + new Date().getTime(),
		userId: req.user.id,
		video: Date.now() + ".mp4",
		title: title,
		views: [],
		likes: [],
		comments: [],
		createdAt: new Date(),
	};
	file.mv(path.join(__dirname, "..", "public", "videos", post.video));
	posts.push(post);
	jsonWriter("posts", posts);
	res.redirect("/admin");
});

router.get("/channel/:username", AuthMiddleware, (req, res) => {
	let username = req.params.username;
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
	for (let i in users) {
		if (users[i].username == username) {
			return res.render("channel", {
				currentUser: req.user,
				users,
				userPosts: posts.filter((p) => p.userId == users[i].id),
			});
		}
	}
	res.redirect("/");
});

router.get("/watch/:video", AuthMiddleware, (req, res) => {
	let videoId = req.params.video;
	let posts = jsonReader("posts");
	let users = jsonReader("users");
	let watch;
	for (let i in posts) {
		for (let j in users) {
			if (posts[i].userId == users[j].id) {
				posts[i].user = users[j];
				break;
			}
		}
	}
	for (let i in posts) {
		if (posts[i].id == `id-${videoId}`) {
			watch = posts[i];
		}
	}
	posts = posts.filter((p) => p.id != watch.id);
	res.render("watch", {
		currentUser: req.user,
		watch,
		users,
		posts,
	});
});

router.get("/like/:videoId", (req, res) => {
	let videoId = req.params.videoId;
	let posts = jsonReader("posts");
	let post = posts.find((p) => p.id == `id-${videoId}`);
});

router.post("/comment/:videoId", (req, res) => {
	let videoId = req.params.videoId;
	let { comment } = req.body;
	if (!comment) return res.status(200).redirect(`/watch/${videoId}`);
	let comments = jsonReader("comments");
	comments.push({
		id: "id-" + Date.now().toString(),
		postId: "id-" + videoId,
		userId: req.user.id,
		text: comment,
	});
	jsonWriter("comments", comments);
	return res.status(200).redirect(`/watch/${videoId}`);
});

module.exports = router;
