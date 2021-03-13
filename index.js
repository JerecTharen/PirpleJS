/*
* API from following the Node JS masterclass from Pirple.com
* Leaner: Jerec Tharen
*/

/* 
    =====================
    Imported Node Modules
    =====================
*/
const _http = require('http');
const _fs = require('fs');
const _url = require('url');

/*
    =====================
    Application Constants
    =====================
*/
const _portNum = 3000;


/*
=============
Server set up
=============
*/
//Set server to respond to all requests with a string
const _server = _http.createServer((req, resp) =>{
    resp.end('Hello There!\nGeneral Kenobi!!!\n');
});
//Get the server to listen to our specified port
_server.listen(_portNum, ()=>{
    console.log(`Server is listening on port ${_portNum}`);

});