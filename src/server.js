const express = require('express');
const axios = require('axios');
const cors = require('cors');
const favicon = require('serve-favicon');
const path = require('path');
const bodyParser = require('body-parser');
const utils = require('./utils');
const llamaApp = require('./llama');
const voicevoxApp = require('./voicevox');


const create = async () => {
    const app = express();

    app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
    app.use(utils.appLogger);
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/APIs', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/client.html'));
    });

    app.use('/llamaApp', llamaApp); 
    app.use('/voicevoxApp', voicevoxApp); 

    app.use(utils.logErrors);
    app.use(utils.clientError404Handler);
    app.use(utils.clientError500Handler);
    app.use(utils.errorHandler);

    return app;
};

module.exports = {
    create
};
