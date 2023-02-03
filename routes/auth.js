const { Router } = require("express");
const router = Router();

router.get("/register", (req, res) => {
	res.render("register", { form: true });
});

router.get("/login", (req, res) => {});

module.exports = router;
