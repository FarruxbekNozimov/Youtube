const express = require("express");
const app = express();
const PORT = 8080;
const { create } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// REQUIRE ROUTES
const AuthRoute = require("./routes/auth.js");
const UserRoute = require("./routes/user.js");

// REQUIRE MIDDLEWARE
const UserMiddleware = require("./middleware/user.js");

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

// USE MIDDLEWARE
app.use(UserMiddleware);

// USE ROUTES
app.use(AuthRoute);
app.use(UserRoute);

app.listen(PORT, () => {
	console.log("Server listening on port " + PORT);
});
