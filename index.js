const express = require("express");
const app = express();
const PORT = 8080;
const { create } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// REQUIRE ROUTES
const AuthRoute = require("./routes/auth.js");

const hbs = create({
	defaultLayout: "main",
	extname: "hbs",
});

app.use(fileUpload());
app.use(cookieParser());

app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// USE ROUTES
app.use(AuthRoute);

app.get("/", (req, res) => {
	res.render("index", {});
});
app.listen(PORT, () => {
	console.log("Server listening on port " + PORT);
});
