const express = require("express"),
	router = express.Router(),
	{ token, helpers } = require("../controllers");
    
router.get("/latency", token.verify, async (req, res, next) => {
	try {
		res.status(200).jsonp({
			latency: helpers.showLatency(res.locals.latency)
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;