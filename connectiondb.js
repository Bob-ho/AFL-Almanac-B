var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');
var path = require('path');
var port = '8082';
var app = express();
var url = 'mongodb://localhost:27017/afl';


app.use('/', express.static('public'));
app.use('/', express.static('html'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/signup.html'));
});
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/login.html'));
});
app.get("/signup", function (req, res) {
	res.sendFile('/signup.html');
});
app.get("/login", function (req, res) {
	res.sendFile('/login.html');
});

router.post('/insert', function (req, res, next) {
	var item = {
		name: req.body.name,
		Email: req.body.e - mail,
		password: req.body.password,
		contact: req.body.contact,
		city: req.body.city,
		address: req.body.address,
	};
	window.document(item);


	mongo.connect(url, function (err, db) {
		assert.equal(null, err);
		db.collection('aflusers').insertOne(item, function (err, result) {
			assert.equal(null, error);
			console.log('item inserted');
		});
	});
	app.post('/', function (req, res) {
		res.render('signup.html');
	});
	app.post('/', function (req, res) {
		res.render('login.html');
	});


	var users = require('./Routes/users');

	app.use('/users', users);

	app.listen(port, function () {
		console.log("server is running" + port);
	});
});


