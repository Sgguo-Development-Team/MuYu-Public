import fs from "fs";
import path from "path";
import { Response } from "express";

interface IAnalysis {
  /**
   * 写功德
   */
  Write: any;
  /**
   * 读功德
   */
  Read: any;
}

const Analysis: IAnalysis = {
  Write(_: any, res: Response): void {
    fs.readFile(path.join(__dirname, "Counter.json"), (err, data) => {
      if (err) {
        res.send({ code: 0, message: "ReadFailed" });
        throw err;
      }
      const content = JSON.parse(data.toString());
      content["AllServer_Gunas"] + 1;
      console.log(content);
      fs.writeFile(
        path.join(__dirname, "Counter.json"),
        JSON.stringify(content),
        (err) => {
          if (err) {
            res.send({ code: 0, message: "WriteFailed" });
            throw err;
          }
        }
      );
    });
    res.send({ code: 1, message: "AnalysisSuccess" });
  },
  Read(_: any, res: Response): void {
    fs.readFile(path.join(__dirname, "Counter.json"), (err, data) => {
      if (err) {
        res.send({ code: 0, message: "ReadFailed" });
        throw err;
      }
      res.send(Object.assign({ code: 1 }, JSON.parse(data.toString())));
    });
  },
};

export default Analysis;
