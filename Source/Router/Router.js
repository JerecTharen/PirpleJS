/**
 * This class is meant to handle routing after the request has been parsed (see Request.js).
 * It will consume Request objects.
 * 
 * TODO: Separate each top level switch into a different areas, then each area will have a map of controllers.
 *      The controller will handle the requests. Trying to stick with what I know and do an MVC pattern.
 */
//Node Dependencies
const _fs = require('fs');
const Data = require('../Data/Data.js');

//Internal Dependencies
const _data = require('../Data/Data.js');

 class Router{
    constructor(request, resp, defaultResponseString = '\nHello There!\nGeneral Kenobi!!!\n'){
        this.Request = request;
        this.Resp = resp;
        this.DefaultResponseString = defaultResponseString; 
        this.DataObj = new _data();
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
        //Send response for delete requests
        else if(this.Request.RequestMethodString === 'delete')
            this.HandleDelete();
        //All other methods:
        else
            this.SendResponse(404, this.DefaultResponseString);
    }

    HandleGet(){
        let allPathsArr = this.GetAllPathsArr();
        switch(allPathsArr[1]){
            case undefined:
                this.DataObj.Read('../', 'index', (err, data) => {
                    if(err){
                        console.error(err);
                        this.SendResponse(500, '\nInternal Server Error', undefined);
                    }
                    else
                        this.SendResponse(200, data, undefined);
                }, 'html');
                break;
            case 'hellothere':
                this.SendResponse(200, 'General Kenobi!!!!\n');
                break;
            case 'ping':
                this.SendResponse(200, 'Server Online');
                break;
            case 'memequotes':
                this.DataObj.Read('MemeQuotes', 'PrequalMeme1', (err, data)=>{
                    if(err){
                        console.error(err);
                        this.SendResponse(500, '\nInternal Server Error.');
                    }
                    else{
                        this.SendResponse(200, undefined, JSON.parse(data));
                    }
                });
                break;
            default:
                this.SendResponse(404, this.DefaultResponseString);
                break;
        }
    }

    HandlePost(){
        let allPathsArr = this.GetAllPathsArr();
        switch(allPathsArr[1]){
            case 'test':
                let testJsonObj = JSON.parse(_fs.readFileSync('./.DATA/test.json'));
                let payloadName = this.Request.PayloadStr.split('=')[1];//TODO: actual parse the payload
                //Set the payload name on the object from the file and send that to the consumer
                testJsonObj.name = payloadName === '' ? testJsonObj.name : payloadName;
                this.SendResponse(200, undefined, testJsonObj);
                break;
            case 'memequotes':
                this.DataObj.WriteOrUpdate('MemeQuotes', 'PrequalMeme1',
                    //Simple little object for testing purposes 
                    {
                        "QuoteName" : "Hello There",
                        "QuoteLines" : [
                            "Hello There",
                            "General Kenobi! You are a bold one."
                        ]
                    }
                )
                .then((dataStr) => {
                    console.log(dataStr);
                    this.SendResponse(200, '\n' + dataStr, undefined);
                })
                .catch((err) => {
                    console.error(`Error: ${err.Message} \nRejection Reason : ${err.Reason}`);
                    this.SendResponse(500, '\nInternal Server Error', undefined);
                });
                break;
            default:
                this.SendResponse(404, this.DefaultResponseString);
                break;
        }
    }

    HandleDelete(){
        let allPathsArr =this.GetAllPathsArr();8
        switch(allPathsArr[1]){
            case 'memequotes':
                this.DataObj.Delete('MemeQuotes', 'PrequalMeme1')
                .then((msg) => {
                    console.log(msg);
                    this.SendResponse(200, '\nFile Deleted Successfully', undefined);
                })
                .catch((errObj) => {
                    console.error(errObj.Message);
                    this.SendResponse(500, '\nInternal Server Error', undefined);
                });
                break;
            default:
                this.SendResponse(404, this.DefaultResponseString);
                break;
        }
    }

    GetAllPathsArr(){
        return this.Request.ParsedPathnameString.split('/');
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