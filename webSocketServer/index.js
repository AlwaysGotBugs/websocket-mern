const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server=http.createServer();
server.listen(webSocketServerPort);
console.log('listiening on port '+webSocketServerPort);

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

const getUniqueId=() =>{
    const s4=()=>Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
    return s4()+s4()+'-'+s4();
}


//on request from client 

wsServer.on('request', function(request){

    var userID=getUniqueId(); //unique id for every user
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + ' . ');

    // Accept connection
    const connection = request.accept(null, request.origin);
    clients[userID]=connection;
    console.log('connected: '+userID +' in '+ Object.getOwnPropertyNames(clients));

    connection.on('message', function(message){
        if(message.type=='utf8'){
            console.log('Received Message: '+message.utf8Data);
            //send message to all clients broadcasting the message
            for(var key in clients){
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to : ',clients[key]);
            }
        }
    });

});