import { readFile, writeFile } from "fs";
import { join as path_join } from "path";
import { Response } from "express";

interface IAnalysis {
  /**
   * 写功德
   */
  Write: (_: any, res: Response) => void;
  /**
   * 读功德
   */
  Read: (_: any, res: Response) => void;
}

const Analysis: IAnalysis = {
  Write(_: any, res: Response): void {
    readFile(
      path_join(__dirname, "Counter.json"),
      (err: NodeJS.ErrnoException | null, data: Buffer): void => {
        if (err) {
          res.send({ code: 0, message: "ReadFailed" });
          throw err;
        }
        const content = JSON.parse(data.toString("utf-8"));
        content["AllServer_Gunas"]++;
        writeFile(
          path_join(__dirname, "Counter.json"),
          JSON.stringify(content),
          () => {
            res.send({ code: 1, message: "AnalysisSuccess" });
          }
        );
      }
    );
  },
  Read(_: any, res: Response): void {
    readFile(
      path_join(__dirname, "Counter.json"),
      (err: NodeJS.ErrnoException | null, data: Buffer): void => {
        if (err) {
          res.send({ code: 0, message: "ReadFailed" });
          throw err;
        }
        res.send(
          Object.assign({ code: 1 }, JSON.parse(data.toString("utf-8")))
        );
      }
    );
  },
};

export default Analysis;
