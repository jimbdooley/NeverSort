var express = require('express');
var app = express();

var my_router = require('./my_router.js');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(my_router);

app.listen(3000, function() { console.log("listening on 3000") });
