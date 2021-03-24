/**
 * This class is meant to handle routing after the request has been parsed (see Request.js).
 * It will consume Request objects.
 * 
 * TODO: Separate each top level switch into a different areas, then each area will have a map of controllers.
 *      The controller will handle the requests. Trying to stick with what I know and do an MVC pattern.
 */
const _fs = require('fs');

 class Router{
    constructor(request, resp, defaultResponseString = 'Hello There!\nGeneral Kenobi!!!\n'){
        this.Request = request;
        this.Resp = resp;
        this.DefaultResponseString = defaultResponseString;
    }

    //Factored out controller logic by method into methods so not to be in the constructor
    //This will help it be more clear that the class will handle requests by calling this
    //instead of just running it when the class is instantiated.
    HandleResponse(){
        //Send Response for get requests
        if(this.Request.RequestMethodString === 'get')
            this.HandleGet();
        //Send response for post requests
        else if(this.Request.RequestMethodString === 'post')
            this.HandlePost();
        //All other methods:
        else
            this.SendResponse(404, defaultResponseString);
    }

    HandleGet(){
        let allPathsArr = this.Request.ParsedPathnameString.split('/');
        switch(allPathsArr[0]){
            case '/hellothere':
                this.SendResponse(200, 'General Kenobi!!!!\n');
                break;
            default:
                this.SendResponse(404, this.DefaultResponseString);
                break;
        }
    }

    HandlePost(){
        switch(this.Request.ParsedPathnameString){
            case '/test':
                let testJsonObj = JSON.parse(_fs.readFileSync('./.DATA/test.json'));
                let payloadName = this.Request.PayloadStr.split('=')[1];//TODO: actual parse the payload
                //Set the payload name on the object from the file and send that to the consumer
                testJsonObj.name = payloadName === '' ? testJsonObj.name : payloadName;
                this.SendResponse(200, undefined, testJsonObj);
                break;
            default:
                this.SendResponse(404, this.DefaultResponseString);
                break;
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