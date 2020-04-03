const express = require("express"),
	router = express.Router(),
	{ user, token } = require("../controllers"),
	_v = require("validator");

router.post("/signup", async (req, res, next) => {
	try {
		if (!(_v.isEmail(req.body.id) || _v.isMobilePhone(req.body.id)) || _v.isEmpty(req.body.password, { ignore_whitespace: true })) throw new Error(`Validation error due signup`);

		let exists = await user.exists(req.body.id);
		if (!exists) {
			let result = await user.create({ id: req.body.id, password: req.body.password });
			if (result) {
				let tokens = await token.create(req.body.id);
				return res.status(200).jsonp(tokens);
			}
		}
		let error = new Error(`User already exists`);
		error.code = 400;
		throw(error);
	} catch (error) {
		next(error);
	}
});

router.post("/signin", async (req, res, next) => {
	try {
		if (!(_v.isEmail(req.body.id) || _v.isMobilePhone(req.body.id)) || _v.isEmpty(req.body.password, { ignore_whitespace: true })) {
			let err = new Error(`Validation error due signin`);
			err.code = 400;
			throw err;
		}

		let exists = await user.exists(req.body.id, req.body.password);
		if (!exists) {
			let result = await token.create(req.body.id);
			if (result) {
				return res.status(200).jsonp(result);
			}
		}
		let error = new Error(`Cannot signin`);
		error.code = 400;
		throw(error);
	} catch (error) {
		next(error);
	}
});

router.post("/signin/newtoken", token.verify, async (req, res, next) => {
	try {
		let result = await token.refresh(res.locals.token);
		res.status(200).jsonp(result);
	} catch (error) {
		next(error);
	}
});

router.get("/logout", token.verify, async (req, res, next) => {
	try {
		let result = await token.refresh(res.locals.token, true);
		res.status(200).jsonp(result);
	} catch (error) {
		next(error);
	}
});

router.get("/info", token.verify, async (req, res, next) => {
	try {
		let tokenInfo = await token.getOne(res.locals.token);
		res.status(200).jsonp({
			id: tokenInfo.login
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
