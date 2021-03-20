/**
 * This class is meant to handle routing after the request has been parsed (see Request.js).
 * It will consume Request objects.
 * 
 * TODO: Separate each top level switch into a different area, then each area will have a map of controllers.
 *      The controllers will handle the requests
 */
const _fs = require('fs');

 class Router{
    constructor(request, resp){
        this.Request = request;
        this.Resp = resp;
        let defaultResponseString = 'Hello There!\nGeneral Kenobi!!!\n';

        //Send Response for get requests
        if(this.Request.RequestMethodString === 'get'){
            let allPathsArr = this.Request.ParsedPathnameString.split('/');
            switch(allPathsArr[0]){
                case '/hellothere':
                    this.Resp.setHeader('Content-Type', 'text/html');
                    this.Resp.writeHead(200);
                    this.Resp.end('General Kenobi!!!!\n');
                    break;
                default:
                    this.Resp.setHeader('Content-Type', 'text/html');
                    this.Resp.writeHead(404);
                    this.Resp.end(defaultResponseString);
                    break;
            }
        }

        //Send response for post requests
        else if(this.Request.RequestMethodString === 'post')
            switch(this.Request.ParsedPathnameString){
                case '/test':
                    let testJsonString = _fs.readFileSync('./.DATA/test.json');
                    this.Resp.setHeader('Content-Type', 'application/json');
                    this.Resp.writeHead(200);
                    this.Resp.end(testJsonString);
                    break;
                default:
                    this.Resp.setHeader('Content-Type', 'text/html');
                    this.Resp.writeHead(404);
                    this.Resp.end(defaultResponseString);
                    break;
            }
        //All other methods:
        else{
            this.Resp.setHeader('Content-Type', 'text/html');
            this.Resp.writeHead(404);
            this.Resp.end(defaultResponseString);
        }
    }
 }

 module.exports = Router;