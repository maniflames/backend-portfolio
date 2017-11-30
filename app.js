const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

//import configurations
const db = require('./db');
const controllers = require('./controllers');
const routes = require('./routes');


app.use(bodyparser.json({type: 'application/json'}));
app.use(bodyparser.urlencoded({extended: false}));

//NOTE: I considering moving 'automatic' routing into a seperate file and requiring it here
routes.forEach(function(route){
    switch(route.method.toUpperCase()) {
        case 'GET':
            app.get(route.path, (req, res) => {
                eval('controllers.' + route.controller)(req, res);
            });
            break;
        case 'POST':
            app.post(route.path, (req, res) => {
                eval('controllers.' + route.controller)(req, res);
            });
            break;
        case 'PUT':
            app.put(route.path, (req, res) => {
                eval('controllers.' + route.controller)(req, res);
            });
            break;
        case 'DELETE':
            app.delete(route.path, (req, res) => {
                eval('controllers.' + route.controller)(req, res);
            });
            break;
        default:
            console.error('Something went wrong');
            break;
    }
});


app.options('*', (req, res) => {
    const filteredRoutes = routes.filter((route) => {

        let testRoute = route.path;
        if(req.originalUrl.length > 1 && req.originalUrl.slice(req.originalUrl.length - 1) === '/' ){
            testRoute = testRoute + '/';
        }

        //TODO:
        //check if the testRoute contains a param in the route
            //If it is the case replace it with a regular expression thay may contain anything but whitespace
        //Compare te originalUrl and the testRoute
        //Remove the comparison method below


        if(req.originalUrl === testRoute){
            return true;
        }

        return false;
    })

    if(filteredRoutes.length === 0){
        res.append('allow', 'OPTIONS,HEAD');
        return res.send();
    }

    const allowedMethods = filteredRoutes.map(route => route.method);

    allowedMethods.push('HEAD');
    allowedMethods.push('OPTIONS');
    res.append('allow', allowedMethods);
    return res.send();
})

let listener = app.listen(process.env.PORT || 8082, function(){
    console.log('Server running @ ' + listener.address().port);
})
