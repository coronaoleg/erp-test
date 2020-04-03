const db = require("../db"),
	path = require("path"),
	config = require("../config"),
	helpers = require("./helpers"),
	numeral = require("numeral");

exports.create = (id, file) => {
	return new Promise((resolve, reject) => {
		let ext = path.extname(file.name).split(".")[1];
		db.query(
			"INSERT INTO `files` (`name`, `ext`, `mime`, `size`, `user_id`, `created_at`, `updated_at`) VALUES (?, ?, ?, ?, ?, NOW(), NOW());",
			[file.name, ext, file.mimetype, file.size, id],
			(error, result) => {
				if (error) reject(error);
				else {
					if (result.affectedRows > 0) {
						file.mv(`${config.files.fileDir}${path.sep}${result.insertId}.${ext}`, error => {
							if (error) reject(error);
							else {
								resolve({
									name: file.name,
									size: numeral(file.size).format("0.00b"),
									id: result.insertId
								});
							}
						});
					} else {
						helpers.removeTempFiles({ file: file });
						reject(new Error(`Cannot insert filedata to db`));
					}
				}
			}
		);
	});
};
exports.list = (id, page, list_size) => {
	if (page < 1) page = 1;
	let startAt = (page - 1) * list_size;

	return new Promise((resolve, reject) => {
		db.query("SELECT `name`, `size`, `ext`, `id` FROM `files` WHERE `user_id` = ? ORDER BY `updated_at` DESC LIMIT ?, ?", [id, startAt, list_size], (error, results) => {
			if (error) reject(error);
			let output = { files: [], page: page, list_size: list_size };
			if (results) {
				for (let file of results) {
					output.files.push({
						name: file.name,
						size: numeral(file.size).format("0.00b"),
						ext: file.ext,
						id: file.id
					});
				}
			}
			resolve(output);
		});
	});
};

exports.get = (uid, id) => {
	return new Promise((resolve, reject) => {
		db.query("SELECT `name`, `size`, `ext`, `id` FROM `files` WHERE `user_id` = ? AND `id` = ? ", [uid, id], (error, results) => {
			if (error) reject(error);
			if (results.length > 0) {
				resolve({
					name: results[0].name,
					size: numeral(results[0].size).format("0.00b"),
					ext: results[0].ext,
					id: results[0].id
				});
			} else {
				let err = new Error(`File not found`);
				err.code = 404;
				reject(err);
			}
		});
	});
};

exports.update = (uid, id, file) => {
	return new Promise((resolve, reject) => {
		let ext = path.extname(file.name).split(".")[1];
		db.query(
			"UPDATE `files` SET `name` = ? , `ext` = ? , `mime` = ? , `size` = ? , `updated_at` = NOW() WHERE `user_id` = ? AND `id` = ? ",
			[file.name, ext, file.mimetype, file.size, uid, id],
			(error, result) => {
				if (error) reject(error);
				else {
					if (result.affectedRows > 0) {
						file.mv(`${config.files.fileDir}${path.sep}${id}.${ext}`, error => {
							if (error) reject(error);
							else {
								resolve({
									name: file.name,
									size: numeral(file.size).format("0.00b"),
									id: id
								});
							}
						});
					} else {
						helpers.removeTempFiles({ file: file });
						reject(new Error(`Cannot update filedata from db`));
					}
				}
			}
		);
	});
};

exports.delete = (uid, id) => {
	return new Promise(async (resolve, reject) => {
		let fileInfo = await exports.get(uid, id).catch(error => reject(error));
		if (fileInfo) {
			db.query("DELETE FROM `files` WHERE `user_id` = ? AND `id` = ?", [uid, id], (error, result) => {
				if (error) reject(error);
				if (result.affectedRows > 0) {
					helpers.removeFile(`${config.files.fileDir}${path.sep}${id}.${fileInfo.ext}`);
					resolve(true);
				} else resolve(false);
			});
		}
	});
};
