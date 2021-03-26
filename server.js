/*
* API from following the Node JS masterclass from Pirple.com
* Learner: Jerec Tharen
*
* Programmer Note: In the lesson, the teacher uses url.parse(). Apparently that is depricated, so instead I'm
* using the new WHATWG URL API instead (see where I'm using searchParams)
* 
* TODO: Send back JSON
* TODO: Confirm that setting the on data end even in Request won't slow down when handling the payload in Router
* TODO: Enable HTTPS
*/

/* 
    =====================
    Imported Node Modules
    =====================
*/
const _http = require('http');
const _https = require('https');
const _fs = require('fs');
const _stringDecoder = require('string_decoder').StringDecoder;

/*
    =========================
    Imported Internal Modules
    =========================
 */
const _config = require('./config.js');
const _Request = require('./Source/Request/Request.js');
const _Router = require('./Source/Router/Router.js');

/*
    =====================
    Application Constants
    =====================
*/
const _httpPortNum = _config.httpPort;
const _httpsPortNum = _config.httpsPort;
//Get SSL stuff
//Used this command to generate via open ssl LTS version 1.1.1
//  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout: key.pem -out cert.pem
const _httpsServerOptions = {
    'key' : _fs.readFileSync('./.HTTPS/key.pem'),
    'cert' : _fs.readFileSync('./.HTTPS/cert.pem')
};



/*
=============
Server set up
=============
*/
//Set up HTTPS and HTTP Servers
/*
 * PROGRAMMER NOTE:
 * Going to do this slighly differently than the instructor.
 * He put together global level server variables that are not
 * reasigned and then listens twice. I instead chose to set up
 * a loop that will set up local instances of server objects,
 * and then listen once. 
 * 
 * It may be a bit over-engineered, but I like the idea of minimizing
 * common code (perhaps a bit too much), and it will make it easier to add
 * other servers later if I want. I just have to make sure they have a port
 * and then a function to handle requests and responses.
 */
let protocolNameObj = {http: 'http', https: 'https'};
let _serverPortArr = [
    {port: _httpPortNum, protocol : protocolNameObj.http},
    {port: _httpsPortNum, protocol : protocolNameObj.https}
];

for(let s = 0; s < _serverPortArr.length; s++){
    let server;
    switch(_serverPortArr[s].protocol){
        case protocolNameObj.http:
            server = _http.createServer((req, resp) => {
                HandleServerLogic(req, resp);
            });
            break;
        case protocolNameObj.https:
            server = _https.createServer(_httpsServerOptions, (req, resp) => {
                HandleServerLogic(req, resp);
            });
            break;
    }
    server.listen(_serverPortArr[s].port, ()=> {
        console.log(`Server is listening for protocol ${_serverPortArr[s].protocol} on port ${_serverPortArr[s].port} 
            for environment ${_config.env_name}`);
    });
}

//Define how to handle requests and how to respond
function HandleServerLogic(req, resp){
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
        Router.HandleResponse();
    });

    //Log response
    //Grab first querystring for testing purposes in logging statments, so get them in an array here
    let testQueryParamArr = [];
    for(let nameString of Request.QuerystringObj.keys())
        testQueryParamArr.push(nameString);
    console.log(`Received request path: "${Request.ParsedPathnameString}", host: "${Request.HostnameString}"
        query: "${Request.QuerystringObj.get(testQueryParamArr[0])}"`);
}