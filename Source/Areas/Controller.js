
/**
 * Base class for all controllers. Will hold methods and properties common between all controllers
 */

//Internal Dependencies
const _data = require('../Data/Data.js');

class Controller{
    constructor(){
        this.ControllerNameStr;
        this.ControllerIndexInt;
        this.Request;
        this.Resp;
        this.DataObj = new _data();
        this.PathsArr = [];
    }

    //Checks if the area has been added to the array of areas.
    //It is then added, and the index stored if not
    SetRegistrationOnController(areaArr, request, resp, pathsArr){
        console.log('registering: ', this.ControllerNameStr);
        this.ControllerIndexInt = areaArr.indexOf(areaArr);
        this.Request = request;
        this.Resp = resp;
        this.PathsArr = pathsArr;
        return areaArr;
    }
}

module.exports = Controller;
