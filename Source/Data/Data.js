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
        //Used to pass data between promises
        this.fileDesc;
        this.filePathStr;
        this.dataStr;
    }

    //TODO: Fix scope mess
    //Write JSON data to a file
    Create(dirNameStr, fileNameStr, dataObj){
        //Open directory
        let openPromise = new Promise((resolve, reject) =>{
            _fs.open(`${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`, 'wx', (err, fileDesc)=>{
                if(!err && fileDesc){
                    let dataStr = JSON.stringify(dataObj);
                    this.fileDesc = fileDesc;
                    _fs.writeFile(fileDesc, dataStr, (err) => resolve(err));
                }
                else
                    reject('Could not create file, it may already exist');
                return openPromise;
            });
        });

        return openPromise
            .then((err) =>{
                err = false;
                let writePromise = new Promise((resolve, reject) => {
                    if(err)
                        reject('Error writing to new file');
                    else
                        _fs.close(this.fileDesc, resolve(err));
                });
                return writePromise;
            })
            .then((err) =>{
                let closePromise = new Promise((resolve, reject) => {
                    if(err)
                        reject('Error closing file');
                    else
                        resolve('File Created Successfully');
                });
                return closePromise;
            });
    }

    //One callback won't hurt, will it?
    Read(dirNameStr, fileNameStr, callbackFunc){
        _fs.readFile(`${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`, 'utf8', (err, data)=>{
            callbackFunc(err, data);
        });
    }

    Update(dirNameStr, fileNameStr, dataOjb){
        this.filePathStr = `${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`;
        this.dataStr = JSON.stringify(dataObj);
        let openPromise = new Promise((resolve, reject) => {
            _fs.open(this.filePathStr, 'r+', (err, fileDesc) =>{
                if(!err && fileDesc)
                    _fs.truncate(this.filePathStr, (err) => resolve(err));
                else
                    reject('Error opening file.');
            });
        });

        return openPromise
            .then((err) => {
                let writePromise = new Promise((resolve, reject) => {

                    
                    if(err)
                        reject('Error truncating file');
                    else
                        _fs.writeFile(this.filePathStr, this.dataStr, (err) => resolve(err));
                });

                return writePromise;
            })
            .then((err) => {
                let closePromise = new Promise((resolve, reject) => {
                    if(err)
                        reject('');
                    _fs.close(this.fileDesc, () => {
                        resolve('File Updated Successfully');
                    });
                });

                return closePromise;
            });

    }


}

module.exports = Data;