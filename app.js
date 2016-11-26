import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import request from 'request';

const app = express()

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Boot up HTTP server
app.server = http.createServer(app);
app.server.listen(3000);