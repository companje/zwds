let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let connections = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});


http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
    
    console.log('new connection');

    // connections++;
    // socket.broadcast.emit('connections', connections);

    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {

        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));

        connections.push(data); 

        console.log('join',connections,data)

        socket.broadcast.emit('connections', connections.length);
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));

        connections = connections.filter((c)=>c!=data)

        console.log('leave',connections,data)

        socket.broadcast.emit('connections', connections.length);
    });

});