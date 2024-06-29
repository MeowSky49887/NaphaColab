const express = require('express');
const axios = require('axios');
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
const bodyParser = require('body-parser')

// fn to create express server
const create = async () => {

    // server
    const app = express();
    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    
    // Log request
    app.use(utils.appLogger);

    // Enable CORS
    app.use(cors()); // Enable CORS for all routes

    app.use(bodyParser.json()) // for parsing application/json

    // root route - serve static file
    app.get('/APIs', (req, res) => res.sendFile(path.join(__dirname, '../public/client.html')));

    app.get('/*', (req, res) => {
        const url = 'https://napha-voicevox.loca.lt' + req.originalUrl; // Append the original URL path to the base URL
    
        axios.get(url, req.body,{
            headers: {
                'bypass-tunnel-reminder': 'true',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            // Set the headers from the external response
            Object.keys(response.headers).forEach(header => {
                res.setHeader(header, response.headers[header]);
            });
    
            // Send the status and data from the external response
            res.status(response.status).send(response.data);
        }).catch(error => {
            // Handle errors appropriately
            if (error.response) {
                // If the error is from the external request, forward the status and message
                res.status(error.response.status).send(error.response.data);
            } else {
                // If the error is in making the request, send a 500 status
                res.status(500).send(error.message);
            }
        });
    });

    app.post('/*', (req, res) => {
        const url = 'https://napha-voicevox.loca.lt' + req.originalUrl; // Append the original URL path to the base URL
    
        axios.post(url, req.body,{
            headers: {
                'bypass-tunnel-reminder': 'true',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            // Set the headers from the external response
            Object.keys(response.headers).forEach(header => {
                res.setHeader(header, response.headers[header]);
            });
    
            // Send the status and data from the external response
            res.status(response.status).send(response.data);
        }).catch(error => {
            // Handle errors appropriately
            if (error.response) {
                // If the error is from the external request, forward the status and message
                res.status(error.response.status).send(error.response.data);
            } else {
                // If the error is in making the request, send a 500 status
                res.status(500).send(error.message);
            }
        });
    });

    // Catch errors
    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};
