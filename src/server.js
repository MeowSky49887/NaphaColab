const express = require('express');
const axios = require('axios');
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path');
const utils = require('./utils');
const bodyParser = require('body-parser');

const create = async () => {
    const app = express();
    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    app.use(utils.appLogger);
    app.use(cors());
    app.use(bodyParser.json());

    const proxyRequest = async (req, res, baseUrl) => {
        const url = baseUrl + req.originalUrl;
        try {
            const response = await axios({
                method: req.method,
                url,
                data: req.body,
                headers: {
                    'bypass-tunnel-reminder': 'true',
                    'Content-Type': 'application/json'
                }
            });

            Object.keys(response.headers).forEach(header => {
                res.setHeader(header, response.headers[header]);
            });

            res.status(response.status).send(response.data);
        } catch (error) {
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
            } else {
                res.status(500).send(error.message);
            }
        }
    };

    // Routes for main endpoint
    app.get('/', (req, res) => proxyRequest(req, res, 'https://napha-voicevox.loca.lt'));
    app.post('/', (req, res) => proxyRequest(req, res, 'https://napha-voicevox.loca.lt'));

    // Routes for llama endpoint
    app.get('/llama/', (req, res) => proxyRequest(req, res, 'https://napha-llama.loca.lt'));
    app.post('/llama/', (req, res) => proxyRequest(req, res, 'https://napha-llama.loca.lt'));

    // Error handling middleware
    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};
