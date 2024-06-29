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

    app.get('/APIs', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client.html'));
    });

    app.get('/*', (req, res) => {
        let url;

        if (req.originalUrl.includes('/llama')) {
            url = 'https://napha-llama.loca.lt' + req.originalUrl.replace("/llama", "");
        } else if (req.originalUrl.includes('/voicevox')) {
            url = 'https://napha-voicevox.loca.lt' + req.originalUrl.replace("/voicevox", "");
        }

        axios.get(url, {
            headers: {
                'bypass-tunnel-reminder': 'true',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            Object.keys(response.headers).forEach(header => {
                res.setHeader(header, response.headers[header]);
            });
            res.status(response.status).send(response.data);
        }).catch(error => {
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
            } else {
                res.status(500).send(error.message);
            }
        });
    });

    app.post('/*', (req, res) => {
        let url;

        if (req.originalUrl.includes('/llama')) {
            url = 'https://napha-llama.loca.lt' + req.originalUrl.replace("/llama", "");
        } else if (req.originalUrl.includes('/voicevox')) {
            url = 'https://napha-voicevox.loca.lt' + req.originalUrl.replace("/voicevox", "");
        }

        axios.post(url, req.body, {
            headers: {
                'bypass-tunnel-reminder': 'true',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            Object.keys(response.headers).forEach(header => {
                res.setHeader(header, response.headers[header]);
            });
            res.status(response.status).send(response.data);
        }).catch(error => {
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
            } else {
                res.status(500).send(error.message);
            }
        });
    });

    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};
