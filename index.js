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
const _stringDecoder = require('string_decoder').StringDecoder;

/*
    =========================
    Imported Internal Modules
    =========================
 */
const _Request = require('./Source/Request/Request.js');

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

    
    let Request = new _Request(req);


    //Send Response for get requests
    if(Request.RequestMethodString === 'get'){
        let allPathsArr = Request.ParsedPathnameString.split('/');
        switch(allPathsArr[0]){
            case '/hellothere':
                resp.end('General Kenobi!!!!\n');
                break;
            default:
                resp.end(responseString);
                break;
        }
    }

    //Send response for post requests
    else if(Request.RequestMethodString === 'post')
        switch(Request.ParsedPathnameString){
            default:
                resp.end(responseString);
        }
    //All other methods:
    else
        resp.end(responseString);

    //Log response
    //Grab first querystring for testing purposes in logging statments, so get them in an array here
    let testQueryParamArr = [];
    for(let nameString of Request.QuerystringObj.keys())
        testQueryParamArr.push(nameString);
    console.log(`Received request path: "${Request.ParsedPathnameString}", host: "${Request.HostnameString}"
        query: "${Request.QuerystringObj.get(testQueryParamArr[0])}"`);
});
//Get the server to listen to our specified port
_server.listen(_portNum, ()=>{
    console.log(`Server is listening on port ${_portNum}`);

});