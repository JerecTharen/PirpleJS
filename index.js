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
//Set server to respond to requests
const _server = _http.createServer((req, resp) =>{
    let responseString = 'Hello There!\nGeneral Kenobi!!!\n';

    //Get URL and parse it
    let urlObj = _url.parse(req.url, true);//True says yes, use querystring module to get query string

    //Parse the path
    let pathnameString = urlObj.pathname;
    //Don't care about removing head '/' characters, only care about removing trailing ones
    let parsedPathnameString = pathnameString.slice(pathnameString.length-1, pathnameString.length) === '/' ? 
        pathnameString.slice(0, pathnameString.length - 1).toLowerCase()
        : pathnameString.toLowerCase();

    //Get query string object - NOTE: This is why we passed 'true' when parsing the url
    let querystringObj = urlObj.query;

    //Parse the method
    let requestMethodString = req.method.toLocaleLowerCase();

    //Send Response for get requests
    if(requestMethodString === 'get')
        switch(parsedPathnameString){
            case '/hellothere':
                resp.end('General Kenobi!!!!\n');
                break;
            default:
                resp.end(responseString);
                break;
        }

    //Send response for post requests
    else if(requestMethodString === 'post')
        switch(parsedPathnameString){
            default:
                resp.end(responseString);
        }
    //All other methods:
    else
        resp.end(responseString);

    //Log response
    console.log(`Received request path: "${pathnameString}", 
        query: "${(()=>{console.log(querystringObj); return 'an object';})()}"`);
});
//Get the server to listen to our specified port
_server.listen(_portNum, ()=>{
    console.log(`Server is listening on port ${_portNum}`);

});