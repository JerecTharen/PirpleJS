/**
 * API that responds to /hello with a JSON welcome message.
 * This is a homework assignment from Pirple.com NodeJS Masterclass course.
 * 
 * Author: Jacob Bennett
 * Creation Date: 03/27/2021
 */

const http = require('http');

let server = http.createServer((req, resp) =>{
    let UrlObj = new URL(req.url, `http://${req.headers.host}`);
    console.log('pathname: ', UrlObj.pathname);
    if(UrlObj.pathname.split('/')[1] === 'hello'){
        resp.setHeader('Content-Type', 'application/json');
        resp.writeHead(200);
        resp.end(JSON.stringify({"message": "world."}));
    }
    else{
        resp.setHeader('Content-Type', 'text/html');
        resp.writeHead(404);
        resp.end('\nRequest not understood');
    }
});

server.listen(3000, ()=>{
    console.log('Homework 1 is listening on port 3000');
});
