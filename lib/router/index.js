require('dotenv').config();
const express = require('express');
const router = express.Router();

//import configurations
const db = require('../db');
const routes = require('../../routes');
const optionsHandler = require('./optionsHandler');

router.use((req, res, next) => {
    if(req.method != 'GET'){
      if(req.get('PASS') != process.env.PASS){
        return res.status(401).send();
      }
    }
    next();
});

router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin' , '*');
    res.append('Access-Control-Allow-Headers', ['Accept', 'Content-Type']);
    res.append('Content-Type', 'application/json');
    next();
})

let loadController = (route, req, res) => {
    let fullController = route.controller
    let controller = fullController.slice(0, fullController.indexOf('.')) 
    let controllerFunction = fullController.slice(fullController.indexOf('.') + 1) 

    let loadedController = require('../../controllers/' + controller)
    return loadedController[controllerFunction](req, res)
}

routes.forEach(function(route){
    const methods = {
        'GET': () =>  { 
            router.get(route.path, (req, res) => { loadController(route, req, res) });
        },

        'POST': () => {
            router.post(route.path, (req, res) => { loadController(route, req, res) });
        },

        'PUT': () => {
            router.put(route.path, (req, res) => { loadController(route, req, res) });
        },

        'DELETE': () => {
            router.delete(route.path, (req, res) => { loadController(route, req, res) });
        }
    };

    methods[route.method]();
})

router.options('*', optionsHandler);
module.exports = router;
