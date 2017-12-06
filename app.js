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
//NOTE: Funnction below should be a seperate function in a routing module
app.use((req, res, next) => {
     req.get('Accept').indexOf('application/json') < 0 ? res.status(400).send({error: 'Accept header not supported'}) : next();
});
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://checker.basboot.nl/');
    res.append('Access-Control-Allow-Headers', ['Accept', 'Content-Type']);
    res.append('Content-Type', 'application/json');
    next();
})

//NOTE: I considering moving 'automatic' routing into a seperate file and requiring it here
//NOTE: Handling options should be a seperate class / module that is called inside of te automatic routing method 'OPTIONS'
routes.forEach(function(route){
    const methods = {
        'GET': function () {
            app.get(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        },

        'POST': function () {
            app.post(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        },

        'PUT': function () {
            app.put(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        },

        'DELETE': function () {
            app.delete(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        }
    };

    methods[route.method]();
})

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

        //TODO:
        //Ignore query in route

        return req.originalUrl === testRoute ? true : false;
    });

    if(filteredRoutes.length === 0){
        res.append('Allow', 'OPTIONS,HEAD');
        res.append('Access-Control-Allow-Methods', 'OPTIONS,HEAD');
        return res.send();
    }

    const allowedMethods = filteredRoutes.map(route => route.method);

    allowedMethods.push('HEAD');
    allowedMethods.push('OPTIONS');
    res.append('Allow', allowedMethods);
    res.append('Access-Control-Allow-Methods', allowedMethods);
    return res.send();
})

let listener = app.listen(process.env.PORT || 8082, function(){
    console.log('Server running @ ' + listener.address().port);
})
