import fs from "fs";
import {execFile,spawn,exec} from 'child_process'
import { inherits } from "util";

class CodeService {
    async execute(code,lang){
        try {
            let path = 'sample';
            if(lang=='javascript'){
                path += '.js'
            }
            else if(lang == 'c++'){
                path += '.cpp'
            }
            // console.log(path);
            fs.writeFile(path,code,(err)=>{
                if(err)
                console.log('This is a ERROR',err);
            })
    
            if(lang=='javascript'){
                function execute(command){
                    return new Promise((resolve,reject)=>{
                        const child = spawn(command,{shell : true});
                        child.stdout.on('data',data=>{
                            resolve(data);
                        })

                        child.stderr.on('data',data=>{
                            reject(data.toString());
                        })
                        
                        child.on('error',(err)=>{
                            console.log('This is child ERROR : ',err)
                            throw { status : '404',message : err};
                        })

                        child.on('exit',(code,signal)=>{
                            console.log('code : ',code );
                            console.log('signal : ',signal );
                        })
                        
                    })
                }
                
                try {                    
                    const output = await execute('node sample.js')
                    console.log('This is the output of the code : ',output.toString()); 
                    if(output);
                    return output.toString();
                } catch (error) {
                    throw {status : '404',message : error};
                }
            }
            else if(lang=='c++'){
                const execute = ()=>{
                    return new Promise((resolve,reject)=>{
                        const child1 = exec('g++ -o run sample.cpp',(err,stdout,stderr)=>{
                            if(stdout){
                                const child2 = exec('./run',(err,stdout,stderr)=>{
                                    if(stdout){
                                        resolve(stdout);
                                    }
                                    else if(stderr){
                                        reject(stderr);
                                    }
                                })
                            }
                            else if(stderr){
                                reject(stderr);
                            }
                        });
                    })
                }
                try {
                    const output = await execute();
                    if(output)
                    return output.toString();
                } catch (error) {
                    throw {status :'404',message : error}
                }


            }
            else{
                throw {status : '404', message : 'Invalid language'}
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new CodeService();