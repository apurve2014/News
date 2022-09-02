const cluster = require("node:cluster");
const express = require("express");
const fs = require("fs");
const cors = require("cors"); //handling the cors-site error for post call.
const app = express();
const sources = require("./source.js");
const http = require("node:http");
const numCPUs = require("node:os").cpus().length;
const process = require("node:process");
const {Worker} = require("node:cluster");
app.use(cors());
if (cluster.isMaster) {
	console.log(` is Master process.pid :${process.pid}`);
	for (let i = 1; i <= numCPUs; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => {
		if (signal) {
			console.warn(`${worker.process.pid} is on ${signal}`);
		} else if (code !== 0) {
			console.log(`worker exited with error code: ${code}`);
		}
		console.log("worker Id : ", Worker.id);
		cluster.fork();
	});
} else {
	console.log(`cluster.isWorker : ${cluster.isWorker}`);
	console.log(`else process.pid :${process.pid}`);
	app.get("/sources", (req, res) => {
		console.log(`Request Methode : ${req.method}`);
		fs.readFile(__dirname + "\\Countrysource.json", (err, data) => {
			if (err) {
				console.error(err);
			}
			let str = data.toString("utf8"); // Converting Buffer Data To JSON String.
			res.send(str);
		});
	});
	app.listen(5400);
}
