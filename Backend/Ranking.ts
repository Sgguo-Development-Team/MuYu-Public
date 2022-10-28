import { Request, Response } from "express";

// 第一方模块

import { pool as db } from "../DB";

interface IRanking {
  getTop10: (req: Request, res: Response) => void;
}

export const Ranking: IRanking = {
  getTop10(req, res) {
    db.query(
      `SELECT id, email, gunas FROM league ORDER BY gunas DESC LIMIT 10`,
      (err, result) => {
        if (err) {
          res.status(500).send({ code: 0, message: "DatabaseError", err: err });
          return;
        }
        res
          .status(200)
          .send({
            code: 1,
            message: "GetInfoSuccess",
            limit: 10,
            data: result,
          });
        console.log(result);
      }
    );
  },
};
