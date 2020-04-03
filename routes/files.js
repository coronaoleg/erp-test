const express = require("express"),
	router = express.Router(),
	{ helpers, token, file } = require("../controllers"),
	_v = require("validator"),
	config = require("../config"),
	path = require("path");

router.post("/upload", async (req, res, next) => {
	try {
		let tokenInfo = await token.getOne(res.locals.token);
		if (req.files && req.files.file) {
			let fileInfo = await file.create(tokenInfo.user_id, req.files.file);
			return res.status(200).jsonp({
				message: `File added`,
				file: fileInfo
			});
		} else {
			let error = new Error(`File expected`);
			error.code = 400;
			throw error;
		}
	} catch (error) {
		helpers.removeTempFiles(req.files);
		next(error);
	}
});

router.get("/list", async (req, res, next) => {
	try {
		let page = _v.isInt(req.body.page) ? parseInt(req.body.page) : 1;
		let list_size = _v.isInt(req.body.list_size) ? parseInt(req.body.list_size) : config.files.list_size;

		let tokenInfo = await token.getOne(res.locals.token);
		let files = await file.list(tokenInfo.user_id, page, list_size);
		if (files) {
			res.status(200).jsonp(files);
		}
	} catch (error) {
		next(error);
	}
});

router.delete("/delete/:id", async (req, res, next) => {
	try {
		if (!_v.isInt(req.params.id)) {
			let err = new Error(`Validation error`);
			err.code = 400;
			throw err;
		}

		let tokenInfo = await token.getOne(res.locals.token);

		let result = await file.delete(tokenInfo.user_id, parseInt(req.params.id));
		if (result) {
			res.status(200).jsonp({
				message: `File deleted`
			});
		}
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		if (!_v.isInt(req.params.id)) {
			let err = new Error(`Validation error`);
			err.code = 400;
			throw err;
		}

		let tokenInfo = await token.getOne(res.locals.token);

		let files = await file.get(tokenInfo.user_id, parseInt(req.params.id));
		if (files) {
			res.status(200).jsonp(files);
		}
	} catch (error) {
		next(error);
	}
});

router.get("/download/:id", async (req, res, next) => {
	try {
		if (!_v.isInt(req.params.id)) {
			let err = new Error(`Validation error`);
			err.code = 400;
			throw err;
		}
		let id = parseInt(req.params.id);
		let tokenInfo = await token.getOne(res.locals.token);
		let files = await file.get(tokenInfo.user_id, id);
		if (files) {
			res.status(200).sendFile(`${config.files.fileDir}${path.sep}${id}.${files.ext}`);
		}
	} catch (error) {
		next(error);
	}
});

router.put("/update/:id", async (req, res, next) => {
	try {
		if (!_v.isInt(req.params.id)) {
			let err = new Error(`Validation error`);
			err.code = 400;
			throw err;
		}
		let tokenInfo = await token.getOne(res.locals.token);
		if (req.files && req.files.file) {
			let fileInfo = await file.update(tokenInfo.user_id, parseInt(req.params.id), req.files.file);
			return res.status(200).jsonp({
				message: `File updated`,
				file: fileInfo
			});
		} else {
			let error = new Error(`File expected`);
			error.code = 400;
			throw error;
		}
	} catch (error) {
		helpers.removeTempFiles(req.files);
		next(error);
	}
});

module.exports = router;
