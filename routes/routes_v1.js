/**
 * Created by Lars on 15-6-2017.
 */
//Dit bestand bevat de endpoints die de logica van de interactie met de database bevat
var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../db/db_connector');


//Test
router.get('/test', function(req, res){
    res.send('Testresults.');
});

//Endpoint voor de registratie van nieuwe gebruikers/klanten
router.post('/register', function (req, res){
    var customer = {
        customer_id: req.body.customer_id,
        store_id: req.body.store_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address_id: req.body.address_id,
        active: req.body.active,
        create_date: req.body.create_date,
        last_update: req.body.last_update,
        password: req.body.password
    };

    var query_str = "INSERT INTO customer VALUES ('" +
        customer.customer_id + "', '" +
        customer.store_id + "', '" +
        customer.first_name + "', '" +
        customer.last_name + "', '" +
        customer.email + "', '" +
        customer.address_id + "', '" +
        customer.active + "', '" +
        customer.create_date+ "', '" +
        customer.last_update + "', '" +
        customer.password + "');";


    console.log(query_str);

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err
        }
        connection.query(query_str, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err;
            }
            res.status(200).json(rows);
        })
    });
});

//Endpoint om films op te zoeken vanaf een geven filmID-index.
//De gebruiker kan optioneel een limiet aan resultaten opgeven.
router.get('/films/offset/:offset/count/:number?', function (req, res) {
    var offset = req.params.offset;
    var number = req.params.number;
    var query_str;

    if ( offset && number) {
        query_str = "SELECT * FROM film LIMIT " + offset + ", "+ number + ";";
    } else if (offset) {
        //query_str = "SELECT * FROM film LIMIT 9999, " + offset + ";";
        query_str = "SELECT * FROM film WHERE film_id >= " + offset + ";";
    } else {
        res.status(404);
        res.json({ "description" : "404 - Response not found. Check your URL and verify you have given a value offset."})
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err
        }
        connection.query(query_str, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err
            }
            res.status(200).json(rows);
        })
    });
});


//Endpoint om films op te zoeken door hun unieke ID op te geven.
//Bij een gebrek aan filmID in de URL worden alle films opgehaald uit de DB.
router.get('/films/:filmid?', function (req, res){
    var filmid = req.params.filmid;
    var query_str;

    if (filmid) {
        query_str = 'SELECT * FROM film WHERE film_id = "' + filmid + '";';
    } else if(!filmid) {
        query_str= 'SELECT * FROM film;';
    } else {
        res.status(404);
        res.json({ "description" : "404 - Response not found.    Wrong parameter, please check your URL again and verify your film id."});
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err
        }
        connection.query(query_str, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err
            }
            res.status(200).json(rows);
        })
    });
});

//Endpoint om alle uitgeleende films van een huurder te bekijken d.m.v. het opgeven van een userID.
router.get('/rentals/:userid', function(req, res){
    var userid = req.params.userid;
    var query_str;

    if (userid) {
        query_str = 'SELECT film.film_id FROM film, inventory, rental, customer ' +
                'WHERE film.film_id = inventory.film_id ' +
                'AND inventory.inventory_id = rental.inventory_id ' +
                'AND rental.customer_id = customer.customer_id ' +
                'AND customer.customer_id = "' + userid + '" ;';

    } else {
        res.status(404);
        res.json({ "description" : "404 - Response not found.    Wrong parameter, please check your URL again and verify your submitted customer id."});
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err
        }
        connection.query(query_str, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err
            }
            res.status(200).json(rows);
        })
    });

});

//Endpoint om een uitlening te verwijderen op basis van opgegeven klant ID en exemplaar ID
router.delete('/rentals/:customerid/:inventoryid', function(req, res){
   var customerid = req.params.customerid;
   var inventoryid = req.params.inventoryid;

   var query_str = "DELETE FROM rental WHERE customer_id = '" + customerid + "' AND inventory_id = '" + inventoryid + "';";
    console.log(query_str);

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err
        }
        connection.query(query_str, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err
            }
            res.status(200).json(rows);
        });
    });
});

//Endpoint om de beschikbaarheid van een exemplaar in het assortiment te veranderen.
//Geef na 'inventory' in URL de id mee en na 'state' de boolean value.
router.post('/inventory/:inventoryid/available/:state', function(req, res){
    var inventoryid = req.params.inventoryid;
    var state = req.params.state;

    var query_str;

    if (inventoryid && state) {
        query_str = "UPDATE inventory SET available = " + state + " WHERE inventory_id = " + inventoryid + ";";
    } else {
        res.status(404);
        res.json({ "description" : "404 - URL not found.    Wrong parameter, please check your URL again and verify your submitted inventory id or state."});
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err
        }
        connection.query(query_str, function (err, rows, fields) {
            connection.release();
            if (err) {
                throw err
            }
            res.status(200).json(rows);
        });
    });
});

module.exports = router;
