/**
 * This class is meant to handle routing after the request has been parsed (see Request.js).
 * It will consume Request objects.
 */

 class Router{
    constructor(request, resp){
        this.Request = request;
        this.Resp = resp;
        let responseString = 'Hello There!\nGeneral Kenobi!!!\n';

        //Send Response for get requests
        if(this.Request.RequestMethodString === 'get'){
            let allPathsArr = this.Request.ParsedPathnameString.split('/');
            switch(allPathsArr[0]){
                case '/hellothere':
                    this.Resp.writeHead(200);
                    this.Resp.end('General Kenobi!!!!\n');
                    break;
                default:
                    this.Resp.writeHead(404);
                    this.Resp.end(responseString);
                    break;
            }
        }

        //Send response for post requests
        else if(this.Request.RequestMethodString === 'post')
            switch(this.Request.ParsedPathnameString){
                default:
                    this.Resp.writeHead(200);
                    this.Resp.end(responseString);
            }
        //All other methods:
        else{
            this.Resp.writeHead(404);
            this.Resp.end(responseString);
        }
    }
 }

 module.exports = Router;