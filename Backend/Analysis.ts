import { readFile, writeFile } from "node:fs/promises";
import { join as path_join } from "node:path";
import { Response, Request } from "express";

// 第一方

import { consoleLogger } from "../Logs";

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
      const data: any = JSON.parse(
          await readFile(path_join(__dirname, "Counter.json"), "utf-8")
        ),
        { gunas } = req.body;
      consoleLogger.debug("文件内容", data);
      writeFile(path_join(__dirname, "Counter.json"), JSON.stringify(data))
        .then(() =>
          res.send({ code: 1, message: "AnalysisSuccess", addGunas: gunas })
        )
        .catch((err) => {
          throw err;
        });
      consoleLogger.debug("修改后功德数", data);
    } catch (error: any) {
      res.send({ code: 0, message: "WriteFailed", err: error });
    }
  },
  async Read(_, res): Promise<void> {
    try {
      const content = await readFile(path_join(__dirname, "Counter.json"));
      res.send(
        Object.assign({ code: 1 }, JSON.parse(content.toString("utf-8")))
      );
    } catch (error) {
      res.send({ code: 0, message: "ReadFailed", err: error });
    }
  },
};
