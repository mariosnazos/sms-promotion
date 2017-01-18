var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var accountSid = 'AC75697df68029f57e7c093f0121ff8598'; 
var authToken = '4bf1b6ce615a2f40d40d5004b2411e18'; 
var client = require('twilio')(accountSid, authToken); 

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
// app.use(express.static(__dirname + '../public'));
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

//app.use(express.bodyParser());
app.get('/api/sms-promotion',function(req,res){
       
    res.render(__dirname + '/api/sms-promotion.html',{
    	phone : '',
    	over18 : '0',
    	acceptTerms : '0',
    	missing : '0'
    });
});

app.post('/api/sms-promotion', function(req, res) {
	// app.use(express.static(__dirname + '/public'));
	var phone = req.body.phone;
	var over18 = req.body.over18 ? 1 : 0;
	var acceptTerms = req.body.acceptTerms ? 1 : 0;
	if (phone.length > 6 && over18 == '1' && acceptTerms=='1'){
		var date = new Date();
		var current_hour = date.getHours();
		var message
		if (current_hour < 12){
			messagebody = 'Good morning! Your promocode is AM123'			
		}else{
			messagebody = 'Hello! Your promocode is PM456'
		}
		client.messages.create({ 
		    to: '+357"'+phone+'"', 
		    from: "+18572775241", 
		    body: messagebody, 
		}, function(err, message) { 
		    if(err){
		      res.send('Sending message Failed');
		    } else {
		      res.send('Success.Message send.');
		    }
		});
	}
	else{
		res.render(__dirname + '/api/sms-promotion.html',{
	    	phone : phone,
	    	over18 : over18,
	    	acceptTerms : acceptTerms,
	    	missing : '1'
	    });
	}
});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

