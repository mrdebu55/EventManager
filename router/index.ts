import express from 'express';
import eventRouter from './eventRouter';
const app = express();
var path = require('path');
var client = path.join(__dirname, 'client');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(client, 'index.html'));
});
app.use('/event',eventRouter);

export default app;
