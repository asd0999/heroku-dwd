var express = require('express');
var app = express();
var bodyParser = require("body-parser");
const url = require('url');
const path = require('path');
var mustacheExpress = require('mustache-express');
//var request = require('request');
const PORT = process.env.PORT || 3000;
var {
  Client
} = require('pg');
var client;
if (process.env.DATABASE_URL) {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
} else {
  client = new Client({
    database: 'inclass3' //agile-citadel-52886
  });
}
client.connect();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
  extended: false
}));
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname);

app.get('/', function(req, res1) {
  client.query('SELECT * FROM posts', function(err, res2) {
    if (err) {
      console.log(error);
    }
    for (let row of res2.rows) {
      console.log(JSON.stringify(row));
    }
    let messagesArray = res2.rows;
    res1.render('index', {
      messagesArray
    });
    // console.log(messagesArray);
    // client.end();
  });

});

app.post('/post', function(req, res3) {
  var message = req.body.message;
  client.query('INSERT INTO posts (messages) VALUES ($1)', [message], function(error, results) {
    if (error) {
      console.log(error);
    }
    res3.redirect('/');
  });
});

app.listen(PORT, function() {
  console.log('Server up! Listening on port: ' + PORT);
});