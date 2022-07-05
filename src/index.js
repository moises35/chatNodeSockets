const express= require('express');
const path = require('path');
const socketio = require('socket.io');
const app = express()
const http = require('http'); 
// Para que heroku no nos bloquee el acceso
const cors = require('cors');

// Settings
app.set('port', process.env.Port || 5000);

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Creamos un servidor HTTP y le pasamos nuestra app de express ya configurada
const server = http.createServer(app);

// Socket.io NO requiere un servidor express, sino de uno HTTP
const io = socketio(server);
require('./socket')(io);


// Iniciar servidor
server.listen(app.get('port'), () => {
    console.log('Server running');
});