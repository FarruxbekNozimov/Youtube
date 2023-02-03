const fs = require("fs");
const request = require("request");

const downloadImg = function (uri, filename, callback) {
	if (!imageExists(uri)) return false;
	request.head(uri, function (err, res, body) {
		request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
	});
	return true;
};

function imageExists(imageUrl) {
	let imgs = ["png", "jpeg", "jpg", "gif"];
	return imgs.includes(
		imageUrl.slice(imageUrl.lastIndexOf(".") + 1, imageUrl.length)
	);
}
module.exports = { downloadImg };
