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

routes.forEach(function(route){
    switch(route.method.toUpperCase()) {
        case 'GET':
            app.get(route.path, function(req, res){
                eval('controllers.' + route.controller)(req, res);
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
            break;
        default:
            console.error('Something went wrong');
            break;
    }
});


//TODO: Right now there is a significant differance between a route that doesn't end with / and the same one that does ...
//Make that dissapear!!!
app.options('*', function(req, res){
    const filteredRoutes = routes.filter(function(route){
        //TODO: analyze path and ignore params
        if(req.originalUrl === route.path){
            return true;
        }

        return false;
    })

    if(filteredRoutes.length === 0){
        res.append('allow', 'OPTIONS');
        return res.send();
    }

    const allowedMethods = filteredRoutes.map(function(route){
        return route.method;
    })

    allowedMethods.push('OPTIONS');
    res.append('allow', allowedMethods);
    return res.send();
})

const models = require('./Models');

let Project = models.Project;
Project.find({hi: 'bye'}, function(err, project){
    console.log('From app.js: ', project);
});

app.listen(8082, function(){
    console.log('Server running @ 8082');
})
