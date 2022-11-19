import { readFile, writeFile } from "node:fs/promises";
import { join as path_join } from "node:path";
import { Response } from "express";
import { Request as JWTRequest } from "express-jwt";

// 第一方

import { consoleLogger } from "../Logs";
import { pool } from "../DB";

type IAuthAnalysis = {
  id: number;
};

export interface IAnalysis {
  WriteLocal: (num: any) => Promise<any>;
  WriteDb: (id: string, num: any) => Promise<any>;
  /**
   * 写功德
   */
  Write: (req: JWTRequest<IAuthAnalysis>, res: Response) => void;
  /**
   * 读功德
   */
  Read: (_: any, res: Response) => void;
}
export const Analysis: IAnalysis = {
  WriteLocal(num): Promise<any> {
    return new Promise<any>(async (resolve) => {
      const data: any = JSON.parse(
          await readFile(path_join(__dirname, "Counter.json"), "utf-8")
        ),
        content: string = JSON.stringify(
          Object.assign(data, { gunas: data.gunas + parseInt(num) })
        );
      await writeFile(path_join(__dirname, "Counter.json"), content);
      resolve(content);
    });
  },
  WriteDb(id, num): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      pool.query(
        `SELECT gunas FROM league WHERE id = ?`,
        [id],
        (err, result: Array<any>) => {
          if (err) {
            reject(err);
            return;
          }
          consoleLogger.debug(result);
          const content = parseInt(num) + result[0]["gunas"];
          pool.query(
            `UPDATE league SET gunas = ? WHERE league.id = ?;`,
            [content, id],
            (err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(content);
            }
          );
        }
      );
    });
  },
  async Write(req, res): Promise<void> {
    try {
      const { gunas } = req.body,
        { id }: any = req.auth,
        result = await Analysis.WriteDb(id, gunas);
      consoleLogger.debug("修改后功德数", await Analysis.WriteLocal(gunas));
      consoleLogger.debug("数据库修改成功", result);
      res.send({
        code: 1,
        message: "AnalysisSuccess",
        add: parseInt(gunas),
        now: result,
      });
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
