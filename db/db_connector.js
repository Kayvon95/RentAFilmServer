/**
 * Created by Kayvon Rahimi on 15-6-2017.
 */
var mysql = require('mysql');
var config = require('../config');

var pool = mysql.createPool({
    connectionLimit: 25,
    host : process.env.DB_HOST || config.dbHost,
    user : process.env.DB_USER || config.dbUser,
    password : process.env.DB_PASSWORD || config.dbPassword,
    database : process.env.DB_DATABASE || config.dbDatabase,
    port : config.dbPort,
    debug: false
});



pool.getConnection( function (err, conn){
    if (err) {
        console.log(err + "It no work.");
    } else {
        console.log("Connected to database '" + config.dbDatabase + "' on " + config.dbPort + '.');
        conn.release();
    }
});

module.exports = pool;