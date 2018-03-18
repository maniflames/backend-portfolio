//NOTE: This file is still kind of a mess, find a way not neatly refactor the code
//NOTE: Maybe route resolving & automatic options seperate as well? That could be overkill though
require('dotenv').config();
const express = require('express');
const router = express.Router();

//import configurations
const db = require('../db');
const controllers = require('../../controllers');
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
})

routes.forEach(function(route){
    const methods = {
        'GET': function () {
            router.get(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        },

        'POST': function () {
            router.post(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        },

        'PUT': function () {
            router.put(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        },

        'DELETE': function () {
            router.delete(route.path, (req, res) => {
                return eval('controllers.' + route.controller)(req, res);
            });
        }
    };

    methods[route.method]();
})

router.options('*', optionsHandler);
module.exports = router;
