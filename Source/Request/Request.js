/**
 * This class is meant to be a factory for request objects. That way all requests are parsed into the same
 * format for my other code to use. This is going to be slightly different from the code in the tutorial I'm
 * following. Mainly in that I'm separating everything out and trying to reduce callbacks.
 */
 const _stringDecoder = require('string_decoder').StringDecoder;

 class Request{
    //constructor(stausCdeInt, hostnameStr, parsedPathnameStr, searchParamsObj, ){
   constructor(req){
      this.UrlObj = new URL(req.url, `http://${req.headers.host}`);

      //Parse the path and host
      this.HostnameString = this.UrlObj.hostname;
      let pathnameString = this.UrlObj.pathname;
      //Don't care about removing head '/' characters, only care about removing trailing ones
      this.ParsedPathnameString = pathnameString.slice(pathnameString.length-1, pathnameString.length) === '/' ? 
          pathnameString.slice(0, pathnameString.length - 1).toLowerCase()
          : pathnameString.toLowerCase();
  
      //Get query string object - NOTE: this is separate from the 
      this.QuerystringObj = this.UrlObj.searchParams;
  
      //Parse the method
      this.RequestMethodString = req.method.toLocaleLowerCase();
  
      //Store the request headers
      this.HeadersObj = req.headers;
  
      
   }
 }

 module.exports = Request;