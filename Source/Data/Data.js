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
        this.error;
        this.returnPromise;
        this.dataObj;
        //Enum of reasons there was an error
        this.RejectionReasonEnum = {
            FileExistsError : 0,
            FileWriteError: 1,
            FileCloseError : 2,
            FileOpenError : 3,
            FileTruncateError : 4,
            FileCloseError : 5
        };
    }

    //Write JSON data to a file
    Create(){
        //Open directory
        let openPromise = new Promise((resolve, reject) =>{
            _fs.open(this.filePathStr, 'wx', (err, fileDesc)=>{
                if(!err && fileDesc){
                    let dataStr = JSON.stringify(this.dataObj);
                    this.fileDesc = fileDesc;
                    _fs.writeFile(fileDesc, dataStr, (err) => resolve(err));
                }
                else
                    reject(new DataErrorModel('Could not create file, it may already exist',
                     this.RejectionReasonEnum.FileExistsError));
                });
            });

        return openPromise
            .then((err) =>{
                this.error = err;//Need to set this to have access to it inside the promise
                let writePromise = new Promise((resolve, reject) => {
                    if(this.error)
                        reject(new DataErrorModel('Error writing to new file',
                         this.RejectionReasonEnum.FileWriteError));
                    else
                        _fs.close(this.fileDesc, (err2) => resolve(err2));
                });
                return writePromise;
            })
            .then((err) =>{
                this.error = err;//Need to set this to have access to it inside the promise
                let closePromise = new Promise((resolve, reject) => {
                    if(this.error)
                        reject(new DataErrorModel('Error closing file', this.RejectionReasonEnum.FileCloseError));
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

    //TODO: get logic of either writing or updating correct
    //TODO: fix bug of updating to empty object
    WriteOrUpdate(dirNameStr, fileNameStr, dataObj){
        this.dataObj = dataObj;
        this.filePathStr = `${this.BASE_DIR_STR}/${dirNameStr}/${fileNameStr}.json`;
        return new Promise((resolve, reject) => {
            _fs.access(this.filePathStr, (err) => {
                if(err){
                    console.log('creating');
                    this.Create().then((err) => resolve(err)).catch((err) => reject(err));
                }
                else{
                    console.log('updating');
                    this.Update().then((err) => resolve(err)).catch((err) => reject(err));
                }
            });
        });
    }

    Update(){
        this.dataStr = JSON.stringify(this.dataObj);
        let openPromise = new Promise((resolve, reject) => {
            _fs.open(this.filePathStr, 'r+', (err, fileDesc) =>{
                this.fileDesc = fileDesc;
                if(!err && fileDesc)
                    _fs.truncate(this.filePathStr, (err2) => resolve(err2));
                else
                    reject(new DataErrorModel('Error opening file.', this.RejectionReasonEnum.FileOpenError));
            });
        });

        return openPromise
            .then((err) => {
                this.error = err;//Need to set this to have access to it inside the promise
                let truncatePromise = new Promise((resolve, reject) => {
                    if(this.error)
                        reject(new DataErrorModel('Error truncating file',
                         this.RejectionReasonEnum.FileTruncateError));
                    else
                        _fs.writeFile(this.filePathStr, this.dataStr, (err2) => resolve(err2));
                });

                return truncatePromise;
            })
            .then((err) => {
                this.error = err;//Need to set this to have access to it inside the promise
                let writePromise = new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    if(this.error)
                    {
                        reject(new DataErrorModel('Error writing back to file',
                        this.RejectionReasonEnum.FileWriteError));
                    }

                    else{
                        _fs.close(this.fileDesc, (err2) => this.resolve(err2));
                    }
                   
                });
                return writePromise;
            })
            .then((err) =>{
                this.error = err;//Need to set this to have access to it inside the promise
                let closePromise = new Promise((resolve, reject) => {
                    if(this.error)
                        reject(new DataErrorModel('Error closing file', this.RejectionReasonEnum.FileCloseError));
                    else
                        resolve('File Updated Successfully');
                });
                return closePromise;
            });
    }
}

class DataErrorModel {
    constructor(message, reason){
        this.Message = message;
        this.Reason = reason;
    }
}

module.exports = Data;