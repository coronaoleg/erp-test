const path = require("path");

const config = {
    database: {
        connectionLimit: 10,
        host: "localhost",
        user: "root",
        password: "",
        database: "test"
    },
    token: {
        accessExpireTime: 600, // 10 mins
        refreshExpireTime: 86400, // 1 day
        secret: 'secretKey' // salt
    },
    upload: {
        limits: {
            fileSize: 5*1024*1024, // 5 mb,
            files: 1, // number of files to upload per req
        },
        useTempFiles: true,
        tempFileDir: `${__dirname}${path.sep}files${path.sep}temp` // tmp dir for uploads
    },
    files: {
        fpp: 10, // files per page,
        fileDir: `${__dirname}${path.sep}files`
    }
};

module.exports = config;