import { readFile, writeFile } from "node:fs/promises";
import { join as path_join } from "node:path";
import { Response, Request } from "express";

// 第一方

import { consoleLogger } from "../Logs";

export interface IAnalysis {
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
        { gunas } = req.body,
        content: string = JSON.stringify(
          Object.assign(data, { gunas: data.gunas + parseInt(gunas) })
        );
      await writeFile(path_join(__dirname, "Counter.json"), content);
      res.send({ code: 1, message: "AnalysisSuccess", add: gunas });
      // Logger
      consoleLogger.debug("修改后功德数", content);
    } catch (error: any) {
      res.send({ code: 0, message: "WriteFailed", err: error });
    }
  },
  async Read(_, res): Promise<void> {
    try {
      const content: any = JSON.parse(
        await readFile(path_join(__dirname, "Counter.json"), "utf-8")
      );
      res.send({ code: 1, message: "ReadSuccess", result: content });
    } catch (error) {
      res.send({ code: 0, message: "ReadFailed", err: error });
    }
  },
};
