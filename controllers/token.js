const db = require("../db"),
	config = require("../config"),
	{ user } = require("./index"),
	crypto = require("crypto");

exports.create = id => {
	return new Promise(async (resolve, reject) => {
		let userInfo = await user.getOne(id).catch(error => reject(error));
		await exports.removeByUserId(userInfo.id).catch(error => reject(error));

		let acccess_exp = Math.ceil(Date.now() / 1000) + config.token.accessExpireTime;
		let refresh_exp = Math.ceil(Date.now() / 1000) + config.token.refreshExpireTime;

		let access = crypto
			.createHash("md5")
			.update(`${id}:${config.token.secret}:${acccess_exp}`)
			.digest("hex");
		let refresh = crypto
			.createHash("md5")
			.update(`${id}:${config.token.secret}:${refresh_exp}`)
			.digest("hex");

		db.query(
			"INSERT INTO `tokens` (`access`, `refresh`, `user_id`, `access_exp`, `refresh_exp`) VALUES (?,?,?,?,?);",
			[access, refresh, userInfo.id, acccess_exp, refresh_exp],
			(error, result) => {
				if (error) reject(error);
				else {
					if (result.affectedRows > 0) {
						let output = {
							accessToken: {
								value: access,
								expireAt: acccess_exp
							},
							refreshToken: {
								value: refresh,
								expireAt: refresh_exp
							}
						};
						resolve(output);
					} else resolve(false);
				}
			}
		);
	});
};

exports.verify = (req, res, next) => {
	if (req.headers.authorization) {
		let token = req.headers.authorization.split(" ")[1];
		let now = Math.ceil(Date.now() / 1000);
		if (token) {
			db.query("SELECT COUNT(*) as `check` FROM `tokens` WHERE (`access` = ? AND `access_exp` > ?) OR (`refresh` = ? AND `refresh_exp` > ?)", [token, now, token, now], (error, result) => {
				if (error) return next(new Error(`Db error: ${error.message}`));
				else {
					if (result[0].check > 0) {
						res.locals.token = token;
						next();
					} else {
						let err = new Error(`Token expired`);
						err.code = 401;
						next(err);
					}
				}
			});
		}
	} else {
		let err = new Error(`Authorization required`);
		err.code = 400;
		next(err);
	}
};

exports.refresh = (token, logout) => {
	return new Promise(async (resolve, reject) => {
		await exports.expired().catch(error => reject(error));
		let tokenInfo = await exports.getOne(token, logout ? "access" : "refresh").catch(error => reject(error));
		if (tokenInfo) {
			await exports.removeByToken(token).catch(error => reject(error));
			let new_tokens = await exports.create(tokenInfo.login).catch(error => reject(error));
			resolve(new_tokens);
		} else {
			let err = new Error(`Invalid token passed`);
			err.code = 401;
			reject(err);
		}
	});
};

exports.getOne = (token, type) => {
	return new Promise((resolve, reject) => {
		db.query(
			"SELECT t.`access`, t.`refresh`, t.`user_id`, u.`login` FROM `tokens` t INNER JOIN `users` u ON t.`user_id`= u.`id` WHERE t.`" + (type || "access") + "` = ?",
			[token],
			(error, result) => {
				if (error) reject(error);
				else {
					if (result) resolve(result[0]);
					else {
						let err = new Error(`Invalid token passed`);
						err.code = 401;
						reject(err);
					}
				}
			}
		);
	});
};

exports.removeByToken = token => {
	return new Promise((resolve, reject) => {
		db.query("DELETE FROM `tokens` WHERE `access` = ? OR `refresh` = ?", [token, token], (error, result) => {
			if (error) reject(error);
			if (result.affectedRows > 0) resolve(true);
			else resolve(false);
		});
	});
};

exports.removeByUserId = id => {
	return new Promise((resolve, reject) => {
		db.query("DELETE FROM `tokens` WHERE `user_id` = ?", [id], (error, result) => {
			if (error) reject(error);
			if (result.affectedRows > 0) resolve(true);
			else resolve(false);
		});
	});
};

exports.expired = () => {
	return new Promise((resolve, reject) => {
		let now = Math.ceil(Date.now() / 1000);
		db.query("DELETE FROM `tokens` WHERE `refresh_exp` < ? ", [now], (error, result) => {
			if (error) reject(error);
			resolve();
		});
	});
};
