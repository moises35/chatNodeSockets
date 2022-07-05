// Exportamos una función que requiere un socket como parametro
module.exports = (io) => {
    let mensajes = [];
    let usersConectados = 0;
    // El parametro socket hace referencia al cliente que se conecta
    io.on('connection', (socket) => {
        usersConectados++;
        // Enviamos los mensajes a todos los clientes conectados
        io.emit('messages', mensajes);
        console.log('Cliente conectado');

        // Si el usuario se conecta
        io.emit('user_connect', usersConectados);

        // Enviamos a los clientes que un nuevo usuario se conecto
        socket.broadcast.emit('new_user', 'Un nuevo usuario se ha conectado');

        // Si es que el usuario quiere eliminar todos los mensajes
        socket.on('deleteAll', () => {
            // Eliminamos todos los mensajes del chat
            mensajes = [];
            io.emit('messages', mensajes);
        });

        // Verificamos si un cliente esta escribiendo
        socket.on('writting', (username) => {
            socket.broadcast.emit('writting', username);
        });
        

        // Evento para saber si nuestro cliente envio un mensaje
        socket.on('message', (data) => {
            mensajes.push(data);
            // Enviamos los mensajes a todos los clientes conectados
            io.emit('messages', mensajes);
        });

        // Evento para cuando el cliente se desconecta
        socket.on('disconnect', () => {
            usersConectados--;
            io.emit('user_disconnect', usersConectados);
            console.log('Cliente desconectado');
        });
    });
};