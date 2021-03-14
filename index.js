/*
* API from following the Node JS masterclass from Pirple.com
* Learner: Jerec Tharen
*
* Programmer Note: In the lesson, the teacher uses url.parse(). Apparently that is depricated, so instead I'm
* using the new WHATWG URL API instead (see where I'm using searchParams)
*/

/* 
    =====================
    Imported Node Modules
    =====================
*/
const _http = require('http');
const _fs = require('fs');

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
    let urlObj = new URL(req.url, `http://${req.headers.host}`);

    //Parse the path and host
    let hostnameString = urlObj.hostname;
    let pathnameString = urlObj.pathname;
    //Don't care about removing head '/' characters, only care about removing trailing ones
    let parsedPathnameString = pathnameString.slice(pathnameString.length-1, pathnameString.length) === '/' ? 
        pathnameString.slice(0, pathnameString.length - 1).toLowerCase()
        : pathnameString.toLowerCase();

    //Get query string object - NOTE: this is separate from the 
    let querystringObj = urlObj.searchParams;

    //Parse the method
    let requestMethodString = req.method.toLocaleLowerCase();

    //Store the request headers
    let headersObj = req.headers;
    console.log('debugging headers, ', headersObj);

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
    //Grab first querystring for testing purposes in logging statments, so get them in an array here
    let testQueryParamArr = [];
    for(let nameString of querystringObj.keys())
        testQueryParamArr.push(nameString);
    console.log(`Received request path: "${pathnameString}", host: "${hostnameString}"
        query: "${querystringObj.get(testQueryParamArr[0])}"`);
});
//Get the server to listen to our specified port
_server.listen(_portNum, ()=>{
    console.log(`Server is listening on port ${_portNum}`);

});