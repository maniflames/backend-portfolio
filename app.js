const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const router = require('./lib/router');

app.use(bodyparser.json({type: 'application/json'}));
app.use(bodyparser.urlencoded({extended: false}));
app.use('/', router);

let listener = app.listen(process.env.PORT || 8082, () => {
    console.log('Server running @ ' + listener.address().port);
})
