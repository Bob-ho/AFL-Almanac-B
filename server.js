var express = require('express');
var path = require('path'); 
var mongo = require('mongodb').MongoClient;;
var bodyParser = require('body-parser');
var crypto = require('crypto');

var app = express();
//enter the name of the database in the end 
var new_db = "mongodb://localhost:27017/";
									app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/index1.html');
}).listen(3000);

console.log("Server listening at : 3000");
app.use('/public', express.static(__dirname + '/public'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname, '/index.html'));
})
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname, '/signup.html'));
})
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname, '/login.html'));
})
app.get("/signup", function(req, res)
{
    res.sendFile('/signup.html');
});
app.get("/login", function(req, res)
{
    res.sendFile('/login.html');
});


var getHash = ( pass , phone ) => {
				
				var hmac = crypto.createHmac('sha512', phone);
				
				//passing the data to be hashed
				data = hmac.update(pass);
				//Creating the hmac in the required format
				gen_hmac= data.digest('hex');
				//Printing the output on the console
				console.log("hmac : " + gen_hmac);
				return gen_hmac;
}
			

// Sign-up function starts here. . .
app.post('/sign_up' ,function(req,res){
	var name = req.body.name;
	var email= req.body.email;
	var pass = req.body.password;
	var phone = req.body.phone;
	var city = req.body.city;
	var address = req.body.address;
	var password = getHash( pass , phone ); 				

	
	var data = {
		"name":name,
		"email":email,
		"password": password, 
		"phone" : phone,
		"city" :city,
		"address" :address
	}
	
	mongo.connect(new_db , function(error , db){
		if (error){
			throw error;
		}
		var dbo = db.db("AFL_Customers");
		console.log("connected to database successfully");
		//CREATING A COLLECTION IN MONGODB USING NODE.JS
		dbo.collection("details").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
			console.log(collection);
		});
	});
	
	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html');  

});				

app.get('/login', function(res, req){
		var phone = req.body.phone;
		var pass =req.body.password;
		var password=getHash(pass, phone);
		mongo.connect(new_db , function(error , db){
		if (error){
			throw error;
		}
		var dbo = db.db("AFL_Customers");
		console.log("connected to database successfully");
		var query={phone : phone, password : password}
		dbo.collection("details").find(query).toArray(function(err , result) {
			if(err) throw err;
			console.log(result);
			
		});
	});
	console.log("DATA is " + JSON.stringify(data) );
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/public/success.html');  

});											