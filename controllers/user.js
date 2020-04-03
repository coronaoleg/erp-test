const db = require("../db");

exports.exists = (id, password) => {
	return new Promise((resolve, reject) => {
		if (typeof password !== "undefined") {
			db.query("SELECT COUNT(*) as `check` FROM `users` WHERE `login` = ? && `password` ", [id, password], (error, result) => {
				if (error) reject(error);
				else resolve(result[0].check > 0 ? true : false);
			});
		} else {
			db.query("SELECT COUNT(*) as `check` FROM `users` WHERE login = ? ", [id], (error, result) => {
				if (error) reject(error);
				else resolve(result[0].check > 0 ? true : false);
			});
		}
	});
};

exports.create = user => {
	return new Promise((resolve, reject) => {
		db.query("INSERT INTO `users` (`login`, `password`) VALUES (?, MD5(?));", [user.id, user.password], (error, result) => {
			if (error) reject(error);
			else {
				if (result.affectedRows > 0) resolve(true);
				else resolve(false);
			}
		});
	});
};

exports.getOne = id => {
	return new Promise((resolve, reject) => {
		db.query("SELECT `id`, `login` FROM `users` WHERE login = ? ", [id], (error, result) => {
			if (error) reject(error);
			else {
				if (result) resolve(result[0]);
				else {
					let err = new Error(`User not found`);
					err.code = 404; 
					reject(err);
				};
			}
		});
	});
};
