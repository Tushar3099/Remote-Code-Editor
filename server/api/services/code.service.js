import fs from "fs";
import {execFile,spawn,exec} from 'child_process'
import { inherits } from "util";

class CodeService {
    execute(code,lang){
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
                let output = '';
                function execute(command,callback){
                    const child = exec(command, function(error, stdout, stderr){
                        console.log('This is stdout', stdout)
                        callback(stdout); 
                    });
                }
                // const child = exec('node sample.js',{shell : true,stdio : 'inherit'})

                execute('node sample.js',(data)=>{
                    output = data;
                    console.log(output); 
                })
                
                console.log('OUTPUT 1', output);
                setTimeout(()=>{
                    console.log('OUTPUT 2', output);
                },1000)
                
                return output;

                // return 'JAVASCRIPT'

            }
            else{
                return 'C++ output'
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new CodeService();