//Import the User model
var User = require("../models/user");
var Player = require("../models/player");
var Collection = require("../models/collection");
var jwt = require('jsonwebtoken');
var aflSecrete = "IamVerySecreteWhereYoucouldnotFineMe";
module.exports = function (router) {
    
     //*****Add To My Collection */
     router.post('/AddToMyCollection', function (req, res) {
        var collection = new Collection();
        collection.username = req.body.username;
        collection.playerID = req.body.playerID;
        collection.save(function (err) {
            if (err) {
                res.json({ success: false, message: 'Unable to save to the database', m: err });
                return;
            }
            else {
                res.json({ success: true, message: 'Add created!' });
            }
        });
     });

    //*****Get player detail */
    router.post('/getPlayerDetail', function (req, res) {
        console.log(req.body.id);
        Player.findOne({_id: req.body.id }).exec(function (err, result) {
            if (err) {
                console.log("error"+ err);
                throw err;
            }
            if (!result) {
                console.log("result");
                res.json({ success: false, message: "Could not get job detail" });
            }
            else {
                console.log("pass");
                res.json({ success: true, result: result });
            }
        });
    });
    //*****Add player details*/
    router.post('/AddPlayer', function (req, res) {
        var player = new Player();
        player.playerName = req.body.playerName;
        player.Position = req.body.Position;
        player.Height = req.body.Height;
        player.Weight = req.body.Weight;
        player.DOB = req.body.DOB;
        player.Debut = req.body.Debut;
        player.Games = req.body.Games;
        player.Goals = req.body.Goals;
        console.log(player);

        player.save(function (err) {
            if (err) {
                res.json({ success: false, message: 'Unable to save to the database', m: err });
                return;
            }
            else {
                res.json({ success: true, message: 'Player created!' });
            }
        });
    });


    //*****User route**********
    //Login route
    router.post('/Login', function (req, res) {
        //Check the password is empty or not
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            res.json({ success: false, message: "Username, password was left empty" });
        }
        else {
            //look at the database to get the username, password and email base on the username
            User.findOne({ username: req.body.username }).select("username password email").exec(function (err, result) {
                if (err) {
                    throw err;
                }
                if (!result) {
                    res.json({ success: false, message: "Could not authenticated user" });
                }
                else if (result) {
                    var valid = result.ComparePassword(req.body.password);
                    if (!valid) {
                        res.json({ success: false, message: "Could not authenticated password" });
                    }
                    else {
                        //generate the token
                        var token = jwt.sign({ username: result.username, email: result.email }, aflSecrete, { expiresIn: '2h' });
                        res.json({ success: true, message: "User authenticated", token: token, username: result.username });

                    }
                }

            });
        }
    });
    //Register route
    router.post('/Register', function (req, res) {

        // Validation prior to checking DB. Front end validation exists, but this functions as a fail-safe
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        console.log(req.body.username);
        console.log(req.body);

        var errors = req.validationErrors(); // returns an object with results of validation check
        if (errors) {
            res.json({ success: false, message: 'Username, email or password was left empty' });
            return;
        }


        //Create the user object of the User Model
        var user = new User();
        //Assign the name, password, email
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        //Save to the database
        user.save(function (err) {
            if (err) {
                res.json({ success: false, message: 'User name or Email already exist' });
                return;
            }
            else {
                res.json({ success: true, message: 'user created!' });
            }
        });
    });

    return router;
}


