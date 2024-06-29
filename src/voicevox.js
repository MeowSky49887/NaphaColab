const express = require('express');
const voicevoxApp = express()

app.get('/*', (req, res) => {
    let url = 'https://napha-voicevox.loca.lt' + req.originalUrl;

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
    let url = 'https://napha-voicevox.loca.lt' + req.originalUrl;

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

module.exports = voicevoxApp;
