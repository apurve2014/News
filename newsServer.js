const cluster = require("node:cluster");
console.log(cluster);
const express = require("express");
const fs = require("fs");
const cors = require("cors"); //handling the cors-site error for post call.
const app = express();
const sources = require("./source.js");
// console.log(sources);
app.use(cors());
app.get("/sources", (req, res) => {
	fs.readFile(__dirname + "\\Countrysource.json", (err, data) => {
		if (err) {
			console.error(err);
		}
		let str = data.toString("utf8"); // Converting Buffer Data To JSON String.
		console.log(str);
		res.send(str);
	});
});
app.listen(5400);
