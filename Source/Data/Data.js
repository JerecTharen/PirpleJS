/**
 * This is a class that will be used to create and retrieve data from /.Data
 * 
 * You'll notice this file is a bit different than the instructors, I ended up
 * looking up how to use promises to reduce the number of callbacks. See the router
 * where this is used for all of my .then() statements that continues the chain.
 * 
 * TODO: Figure out if I can get the rest of the _fs calls in that router switch
 * into here.
 */

//NodeJS Module Dependencies
const _fs = require('fs');
const _path = require('path');


//Exported code
class Data{
    constructor(){
        this.BASE_DIR_STR = _path.join(__dirname, '../../.Data/');
    }

    //Write JSON data to a file
    Create(dirNameStr, fileNameStr, dataObj){
        //Open directory
        let openPromise = new Promise((resolve, reject) =>{
            _fs.open(`${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`, 'wx', (err, fileDesc)=>{
                if(!err && fileDesc){
                    let dataStr = JSON.stringify(dataObj);
                    _fs.writeFile(fileDesc, dataStr, (err) => resolve(err, fileDesc, dataStr));
                }
                else
                    reject('Could not create file, it may already exist');
                return openPromise;
            });
        });
        return openPromise;
    }

    //One callback won't hurt, will it?
    Read(dirNameStr, fileNameStr, callbackFunc){
        _fs.readFile(`${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`, 'utf8', (err, data)=>{
            callbackFunc(err, data);
        });
    }

    Update(dirNameStr, fileNameStr, data, callbackFunc){

    }


}

module.exports = Data;