import express, {  } from "express";
import bodyParser from "body-parser";
import Router from './router/index';
import * as dotenv from "dotenv";
import {socketConnection} from './controller/userController';
dotenv.config({});
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/',Router);

export const ApplicationApp: express.Application = app;

io.on('connection', (socket:any) => {
  socketConnection(socket);
  socket.on('disconnect', () => {
  });
});

server.listen(process.env.PORT || 8888, () => {
    console.log(`Listening to port ${process.env.PORT || 8888}`);
});
