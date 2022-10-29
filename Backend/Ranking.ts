import { Response } from "express";

// 第一方模块

import { pool as db } from "../DB";
import { consoleLogger } from "../Logs";

interface IRanking {
  getTop10: (_req: any, res: Response) => void;
}

export const Ranking: IRanking = {
  getTop10(_req, res) {
    db.query(
      `SELECT id, email, gunas FROM league ORDER BY gunas DESC LIMIT 10`,
      (err, result) => {
        if (err) {
          res.status(500).send({ code: 0, message: "DatabaseError", err: err });
          return;
        }
        res.status(200).send({
          code: 1,
          message: "GetInfoSuccess",
          limit: 10,
          data: result,
        });
        consoleLogger.debug("排行榜数据库", result);
      }
    );
  },
};
