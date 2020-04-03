const numeral = require("numeral"),
	fs = require("fs");

exports.memoryUsage = () => {
	let memory = process.memoryUsage();
	return numeral(memory.rss).format("0.00b");
};

exports.latency = (req, res, next) => {
	res.locals = process.hrtime();
	next();
};

exports.showLatency = time => {
	let diff = process.hrtime(time);
	return Math.round(diff[1]/1000000) + " ms";
};

exports.removeTempFiles = files => {
	for(let file in files){
		fs.unlinkSync(files[file].tempFilePath);
	}
};

exports.removeFile = path => {
	fs.unlinkSync(path);
};