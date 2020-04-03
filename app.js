const express = require("express"),
	helmet = require("helmet"),
	cors = require("cors"),
	bp = require("body-parser"),
	app = express(),
	users = require("./routes/users"),
	index = require("./routes/index"),
	files = require("./routes/files"),
	{ helpers, token } = require("./controllers"),
	upload = require("express-fileupload"),
	config = require("./config");

app.use(helpers.latency);
app.use(helmet());
app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use("/file", upload(config.upload));

app.use("/", index);
app.use("/", users);
app.use("/file", token.verify, files);

app.use((req, res, next) => {
	next(new Error(`404: ${req.originalUrl}`));
});

app.use((error, req, res, next) => {
	console.log(`Error message: ${error.message}`);
	console.log(`Error stack: ${error.stack}`);
	if (error.code) {
		res.status(error.code).jsonp({
			error: `${error.message}`
		});
	} else {
		res.status(500).jsonp({
			error: `Internal Server Error`
		});
	}
});

app.listen(666, () => {
	console.log(`Server's running`);
});
