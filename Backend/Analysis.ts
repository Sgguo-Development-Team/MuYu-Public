import { readFile, writeFile } from "node:fs/promises";
import { join as path_join } from "node:path";
import { Response, Request } from "express";

interface IAnalysis {
  /**
   * 写功德
   */
  Write: (req: Request, res: Response) => void;
  /**
   * 读功德
   */
  Read: (_: any, res: Response) => void;
}

export const Analysis: IAnalysis = {
  async Write(req, res): Promise<void> {
    try {
      const data: Buffer = await readFile(path_join(__dirname, "Counter.json")),
        content = JSON.parse(data.toString("utf-8")),
        { gunas } = req.body;
      content["gunas"] + gunas;
      writeFile(path_join(__dirname, "Counter.json"), JSON.stringify(content))
        .then(() =>
          res.send({ code: 1, message: "AnalysisSuccess", addGunas: gunas })
        )
        .catch((err) => {
          throw err;
        });
    } catch (error: any) {
      res.send({ code: 0, message: "ReadFailed", err: error });
    }
  },
  async Read(_, res): Promise<void> {
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
