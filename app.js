const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./routes');
const controllers = require('./controllers');

app.use(bodyparser.json({type: 'application/json'}));
app.use(bodyparser.urlencoded({extended: false}));

routes.forEach(function(route){

    switch(route.method.toUpperCase()) {
        case 'GET':
            app.get(route.path, function(req, res){
                eval('controllers.' + route.controller)(req, res);
            });
            app.get(route.path, function(req, res){
                return res.send('YOOOOOOOOOOO');
            });
            break;
        case 'POST':
            app.post(route.path, function(req, res){
                eval('controllers.' + route.controller)(req, res);
            });
            break;
        case 'PUT':
            app.put(route.path, function(req, res){
                eval('controllers.' + route.controller)(req, res);
            });
            break;
        case 'DELETE':
            app.delete(route.path, function(req, res){
                eval('controllers.' + route.controller)(req, res);
            });
        default:
            console.log('Something went wrong');
            break;
    }

    //NOTE: This should not be done for every route instead for every route an array with all options (methods) should be made
    //all those arrays should be placed in a multidimentional array & for each array inside the multidimentional array should be an options handler.
    app.options(route.path, function(req, res){
        return res.send('look at the options of ' + route.path);
    });

});

app.listen(8082, function(){
    console.log('Server running @ 8082');
})
