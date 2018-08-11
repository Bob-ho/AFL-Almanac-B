//Import the User model
var User = require("../models/user");
module.exports = function (router) {

    //*****User route**********

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


