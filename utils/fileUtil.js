const fs = require("fs");

let jsonReader = (fileName) => {
	return JSON.parse(fs.readFileSync("./models/" + fileName + ".json"));
};

const jsonWriter = (fileName, data) => {
	return fs.writeFile(
		`./models/${fileName}.json`,
		JSON.stringify(data, null, 2),
		(err) => {
			if (err) throw err;
			console.log("Created!");
		}
	);
};

module.exports = { jsonReader, jsonWriter };
