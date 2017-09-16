const express = require('express');
const app = express();

app.use(express.static(__dirname, + 'index.html'));

app.get('index.html', function(request,response){
	console.log('I got the get request.');
})

app.listen(process.env.PORT);