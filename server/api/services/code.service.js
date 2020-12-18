import fs from "fs";
import { execFile, spawn, exec } from "child_process";

class CodeService {
  async execute(code, lang) {
    try {
      //writing the file
      const path = await this.writeFile(code, lang);
      //executing the file
      let output = "";
      switch (lang) {
        case "javascript": {
          output = await this.execChild(`node ${path}`);
          break;
        }
        case "c++": {
          output = await this.execChild(`g++ -o run ${path} && run`);
          break;
        }
        default: {
          throw "Invalid language";
        }
      }
      if (output) return output.toString();
      fs.unlink(path);
    } catch (error) {
      throw { status: "404", message: error };
    }
  }

  async writeFile(code, lang) {
    let path = "sample";
    switch (lang) {
      case "javascript": {
        path += ".js";
        break;
      }
      case "c++": {
        path += ".cpp";
        break;
      }
      default: {
      }
    }
    fs.writeFile(path, code, (err) => {
      if (err) throw { message: err };
    });
    return path;
  }

  async execChild(command) {
    // console.log(command);
    return new Promise((resolve, reject) => {
      const child = spawn(command, { shell: true });
      child.stdout.on("data", (data) => {
        resolve(data);
      });

      child.stderr.on("data", (data) => {
        reject(data.toString());
      });

      child.on("error", (err) => {
        throw { status: "404", message: err };
      });

      child.on("exit", (code, signal) => {
        console.log("code : ", code);
        console.log("signal : ", signal);
      });
    });
  }
}

export default new CodeService();
