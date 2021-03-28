/**
 * This is a class that will be used to create and retrieve data from /.Data
 * 
 * Notice the pelthora of callbacks here? TODO: Review ES6 Promises and then simplify callbacks
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
    Create(dirNameStr, fileNameStr, dataObj, callbackFunc){
        //Open directory
        _fs.open(`${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`, 'wx', (err, fileDesc)=>{
            if(!err && fileDesc){
                //Write Data
                let dataStr = JSON.stringify(dataObj);
                _fs.writeFile(fileDesc, dataStr, (err)=>{
                    if(err)
                        callbackFunc('Error writing to new file');
                    else
                        _fs.close(fileDesc, (err)=>{
                            if(err)
                                callbackFunc('Error closing file');
                            else
                                callbackFunc(false);//Everything worked succesfully
                    });
                });
            }
            else{
                callbackFunc('Could not create file, it may already exist');
            }
        });

    }


}

module.exports = Data;