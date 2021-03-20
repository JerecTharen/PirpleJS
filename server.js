/*
* API from following the Node JS masterclass from Pirple.com
* Learner: Jerec Tharen
*
* Programmer Note: In the lesson, the teacher uses url.parse(). Apparently that is depricated, so instead I'm
* using the new WHATWG URL API instead (see where I'm using searchParams)
* 
* TODO: Send back JSON
* TODO: Confirm that setting the on data end even in Request won't slow down when handling the payload in Router
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
const _Router = require('./Source/Router/Router.js');

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
    
    let Request = new _Request(req);
    let Router;

    //Decoding the request payload
    let decoderObj = new _stringDecoder('utf-8');
    let bufferString = '';
    req.on('data', (data)=>{
        bufferString += decoderObj.write(data);
    });
    //Log the payload
    req.on('end', ()=>{
        decoderObj.end();
        console.log('payload was: ', bufferString);
        Request.PayloadStr = bufferString;
        console.log('Request sent with these headers: ', Request.HeadersObj);
        Router = new _Router(Request, resp);
    });

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