
/**
 * Base class for all controllers. Will hold methods and properties common between all controllers
 */
class Controller{
    constructor(){
        this.ControllerNameStr;
        this.ControllerIndexInt;
    }

    //Checks if the area has been added to the array of areas.
    //It is then added, and the index stored if not
    SetIndexFromArray(areaArr){
        console.log('registering: ', this.ControllerNameStr);
        this.ControllerIndexInt = areaArr.indexOf(areaArr);
        return areaArr;
    }
}

module.exports = Controller;
