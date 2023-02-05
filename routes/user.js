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
	let convertFileSize = (s) =>
		s.toString().slice(0, s.toString().indexOf(".") + 3);
	let posts = jsonReader("posts");
	const { file } = req.files;
	console.log(convertFileSize(file.size / (1024 * 1024)));
	const post = {
		id: "id-" + new Date().getTime(),
		userId: req.user.id,
		video: Date.now() + ".mp4",
		title: title,
		size: convertFileSize(file.size / (1024 * 1024)),
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
	let comments = jsonReader("comments");
	for (let i in posts) {
		if (
			posts[i].id == `id-${videoId}` &&
			!posts[i].views.includes(req.user.id)
		) {
			posts[i].views.push(req.user.id);
			jsonWriter("posts", posts);
			break;
		}
	}
	for (let i in posts) {
		for (let j in users) {
			if (posts[i].userId == users[j].id) {
				posts[i].user = users[j];
				break;
			}
		}
	}
	let watch = posts.find((p) => p.id == `id-${videoId}`);
	posts = posts.filter((p) => p.id != watch.id);
	let watchComments = comments.filter((c) => c.postId == watch.id);
	for (let i in watchComments) {
		watchComments[i].user = users.find((u) => u.id == watchComments[i].userId);
	}
	res.render("watch", {
		currentUser: req.user,
		watch,
		users,
		posts,
		watchComments,
	});
});

router.post("/like/:videoId", AuthMiddleware, (req, res) => {
	let videoId = req.params.videoId;
	let posts = jsonReader("posts");
	let post = posts.find((p) => p.id == `id-${videoId}`);
	for (let i in posts) {
		if (posts[i].id == `id-${videoId}`) {
			!posts[i].likes.includes(req.user.id)
				? posts[i].likes.push(req.user.id)
				: (posts[i].likes = posts[i].likes.filter((l) => l.id == req.user.id));
			jsonWriter("posts", posts);
			break;
		}
	}
	res.redirect("/watch/" + videoId);
	console.log(videoId, posts, post);
});

router.post("/comment/:videoId", AuthMiddleware, (req, res) => {
	let videoId = req.params.videoId;
	let { comment } = req.body;
	if (!comment) return res.status(200).redirect(`/watch/${videoId}`);
	let comments = jsonReader("comments");
	let posts = jsonReader("posts");
	for (let i in posts) {
		if (posts[i].id == `id-${videoId}`) {
			posts[i].comments += 1;
			break;
		}
	}
	comments.push({
		id: "id-" + Date.now().toString(),
		postId: "id-" + videoId,
		userId: req.user.id,
		text: comment,
	});
	jsonWriter("comments", comments);
	jsonWriter("posts", posts);
	return res.status(200).redirect(`/watch/${videoId}`);
});

router.post("/update/:videoId", AuthMiddleware, (req, res) => {
	let videoId = req.params.videoId;
	let posts = jsonReader("posts");
	for (let i in posts) {
		if (posts[i].id == `${videoId}`) {
			posts[i].title = req.body.title;
			break;
		}
	}
	jsonWriter("posts", posts);
	return res.status(200).redirect(`/admin`);
});

router.post("/update/:videoId", AuthMiddleware, (req, res) => {
	let videoId = req.params.videoId;
	let posts = jsonReader("posts");
	for (let i in posts) {
		if (posts[i].id == `${videoId}`) {
			posts[i].title = req.body.title;
			break;
		}
	}
	jsonWriter("posts", posts);
	return res.status(200).redirect(`/admin`);
});

router.post("/delete/:videoId", AuthMiddleware, (req, res) => {
	let videoId = req.params.videoId;

	let posts = jsonReader("posts");
	posts = posts.filter((p) => p.id != `id-${videoId}`);
	jsonWriter("posts", posts);
	return res.status(200).redirect(`/admin`);
});

module.exports = router;
