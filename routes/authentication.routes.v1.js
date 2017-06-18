/**
 * Created by Lars on 15-6-2017.
 */
var express = require('express');
var router = express.Router();
var auth = require('../auth/authentication');
var db = require('../db/db_connector');

router.post('/login', function (req, res) {

    // laat inhoud zien
    console.dir(req.body);

    // username en password worden in body gegeven
    var email = req.body.email || '';

    var password = req.body.password || '';

    // db query ; geeft alle info van de email & password combinatie uit de body; wanneer de uitkomst leeg is, en je dus
    // geen match hebt, wordt er geen token gegenereerd. 
    db.query('SELECT * FROM customer WHERE email = "' + email + '" AND password = "' + password + '"', function (error, rows) {
        if (rows != "") {
            var token = auth.encodeToken(email);
            res.status(200).json({
                "token": token
            })
        } else {
            res.status(401).json({"error": "Invalid credentials."})
        }
    });
});


// maak route beschikbaar
module.exports = router;