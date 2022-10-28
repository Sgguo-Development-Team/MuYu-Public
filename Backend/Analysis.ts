import { readFile, writeFile } from "node:fs/promises";
import { join as path_join } from "node:path";
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
  async Write(_: any, res: Response): Promise<void> {
    try {
      const data: Buffer = await readFile(path_join(__dirname, "Counter.json"));
      const content = JSON.parse(data.toString("utf-8"));
      content["gunas"]++;
      writeFile(path_join(__dirname, "Counter.json"), JSON.stringify(content))
        .then(() => res.send({ code: 1, message: "AnalysisSuccess" }))
        .catch((err) => {
          throw err;
        });
    } catch (error: any) {
      res.send({ code: 0, message: "ReadFailed", err: error });
    }
  },
  async Read(_: any, res: Response): Promise<void> {
    try {
      const content = await readFile(path_join(__dirname, "Counter.json"));
      res.send(
        Object.assign({ code: 1 }, JSON.parse(content.toString("utf-8")))
      );
    } catch (error) {
      res.send({ code: 0, message: "ReadFailed" });
    }
  },
};

export default Analysis;
