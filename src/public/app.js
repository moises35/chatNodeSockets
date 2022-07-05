const socket = io()

// Obtenemos los campos del chat
const username = document.getElementById('username');
const write_message = document.getElementById('write_message');
const all_message = document.getElementById('all_message');
const new_user = document.getElementById('new_user');
const writting = document.getElementById('writting');
const enviar = document.getElementById('enviar');
const deleteAll = document.getElementById('deleteAll');
const num_users = document.getElementById('num_users');
let time = '00:00:00';

// Agregamos un evento para detectar el enter para el envio del mensaje
enviar.addEventListener('click', () => {
    // Verificamos que los campos tengan contenido
    write_message.value = write_message.value.slice(0, -1);
    if(username.value !== '' && write_message.value !== ''){
        // Enviamos el mensaje al servidor
        socket.emit('message', {
            username: username.value,
            message: write_message.value,
            time: new Date().toLocaleTimeString()
        })
        // Limpiamos los campos
        write_message.value = ''
    } else {
        console.log('No se puede enviar el mensaje')
    }    
});

deleteAll.addEventListener('click', () => {
    // Eliminamos todos los mensajes del chat
    socket.emit('deleteAll');
});

write_message.addEventListener('keyup', (e) => {
    // Verificamos que la tecla presionada sea enter
    if(e.code == 'Enter'){
        // Verificamos que los campos tengan contenido
        write_message.value = write_message.value.slice(0, -1);
        if(username.value !== '' && write_message.value !== ''){
            // Enviamos el mensaje al servidor
            socket.emit('message', {
                username: username.value,
                message: write_message.value,
                time: new Date().toLocaleTimeString()
            })
            // Limpiamos los campos
            write_message.value = ''
        } else {
            console.log('No se puede enviar el mensaje')
        }
    }
});


// Escuchamos el evento 'messages' del servidor
socket.on('messages', (data) => {
    var content = '';
    data.forEach(element => {
        let clase ='';
        if(element.username == username.value){
            clase = 'message_mio';
        } else {
            clase = 'message';
        }
        content += `
            <div class = '${clase}'>
                <strong>${element.username}</strong>
                <span>(${element.time}): </span>
                <span>${element.message}</span>
            </div>
            <br>
        `
    });
    all_message.innerHTML = content;
    all_message.scrollTop = all_message.scrollHeight;
});

// Escuchamos el evento 'new_user' del servidor
socket.on('new_user', (data) => {
    new_user.innerHTML = `<i>${data}</i>`;;
    setTimeout(() => {
        new_user.innerHTML = '';
    }, 3000);
});


// Escuchamos el evento cuando un usuario está escribiendo
write_message.addEventListener('keydown', (e) => {	
    // Verificamos que el campo de user no este vacio
    if(username.value !== ''){
        // Enviamos el evento al servidor
        socket.emit('writting', username.value);
    }
});


socket.on('writting', (data) => {
    writting.innerHTML = `<i>${data} esta escribiendo...</i>`;
    setTimeout(() => {
        writting.innerHTML = '';
    }, 3000);
});


// Escuchar los users conectados y desconectados
socket.on('user_connect', (number) => {
    num_users.innerHTML = number;
});

socket.on('user_disconnect', (number) => {
    num_users.innerHTML = number;
});