/**
 * This class is meant to handle routing after the request has been parsed (see Request.js).
 * It will consume Request objects.
 * 
 * TODO: Separate each top level switch into a different areas, then each area will have a map of controllers.
 *      The controller will handle the requests. Trying to stick with what I know and do an MVC pattern.
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
                    this.SendResponse(200, 'General Kenobi!!!!\n');
                    break;
                default:
                    this.SendResponse(404, defaultResponseString);
                    break;
            }
        }

        //Send response for post requests
        else if(this.Request.RequestMethodString === 'post')
            switch(this.Request.ParsedPathnameString){
                case '/test':
                    let testJsonObj = JSON.parse(_fs.readFileSync('./.DATA/test.json'));
                    let payloadName = this.Request.PayloadStr.split('=')[1];//TODO: actual parse the payload
                    //Set the payload name on the object from the file and send that to the consumer
                    testJsonObj.name = payloadName === '' ? testJsonObj.name : payloadName;
                    this.SendResponse(200, undefined, testJsonObj);
                    break;
                default:
                    this.SendResponse(404, defaultResponseString);
                    break;
            }
        //All other methods:
        else{
            this.SendResponse(404, defaultResponseString);
        }
    }

    //Sets headers and sends response back to requester
    //Defaults to sending back plain text
    SendResponse(statusCodeNum = 404, textString = '', jsonObj = {}){
        //Set up headers
        let contentTypeString = '';
        let responsePayloadString = '';
        if(Object.keys(jsonObj).length !== 0){
            contentTypeString = 'application/json';
            responsePayloadString = JSON.stringify(jsonObj);
        }
        else{
            contentTypeString = 'text/html';
            responsePayloadString = textString;
        }
        
        //Send response
        this.Resp.setHeader('Content-Type', contentTypeString);
        this.Resp.writeHead(statusCodeNum);
        this.Resp.end(responsePayloadString);

    }
 }

 module.exports = Router;