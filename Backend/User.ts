import { sign as jwt_sign } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";
import { compare as bcrypt_compare } from "bcryptjs";

// 第一方模块

import db from "../db";
import config from "../config";

/**
 * 用户相关功能 - 服务层
 */
interface IUser {
  /**
   * 测试用户密码信息
   * @param id 用户 ID
   * @param password 密码
   * @returns {Promise} 结果
   */
  Verify: (id?: string | number, password?: string) => Promise<any>;
  /**
   * 登录功能
   * @param req Express.Request
   * @param res Express.Response
   */
  Login: (req: Request, res: Response) => void;
  /**
   * 删除账号
   * @param req Express.Request
   * @param res Express.Response
   */
  Delete: (req: Request, res: Response) => void;
  /**
   * 检测用户名合法性
   */
  RegExp: RegExp | string;
  /**
   * 检测 Token 合法性
   * @param req JWTRequest
   * @param res Express.Response
   */
  Check: (req: Request, res: Response) => void;
}
type Auth = {
  id?: number | string;
  password?: string;
  username?: string;
};

const User: IUser = {
  Verify(id: any, password: any): Promise<any> {
    const query = `SELECT password FROM league WHERE id = ?`;
    return new Promise<any>((resolve, reject) => {
      db.query(query, [id], async (err, result: any) => {
        // 有错误就抛出
        if (err) reject(err ?? "UnknownError");
        // 计算值
        try {
          const compareResult = await bcrypt_compare(
            password,
            result[0]["password"]
          );
          // 设置状态为已解决
          resolve({
            status: compareResult,
            msg: compareResult ? "LoginSuccess" : "LoginFailed",
          });
        } catch {
          reject({
            err: `Error - in compare | ID ${id}: NotExist.`,
            others: "Uncaught Error.",
          });
        }
      });
    });
  },
  Login(req: Request, res: Response) {
    const { id, password }: Auth = req.body;
    User.Verify(id, password)
      .then((result) => {
        if (result.status) {
          res.status(200).send({
            code: 1,
            message: result.msg,
            token: jwt_sign({ id, password }, config.server.secretKey, {
              algorithm: "HS256",
              expiresIn: 1000 * 60 * 60 * 24 * 7,
            }),
          });
        } else {
          res.status(403).send({
            code: 0,
            message: result.msg,
          });
        }
      })
      .catch((err) => {
        res.status(502).send({ code: 0, message: err });
      });
  },
  Delete(req: Request, res: Response): void {
    const { id, password }: Auth = req.body;
    const query = `DELETE FROM league WHERE id = ?`;
    User.Verify(id, password)
      .then(() => {
        db.query(query, [id], (err): void => {
          if (err) throw err;
          res.status(200).send({ code: 1, message: "DeleteSuccessful" });
        });
      })
      .catch((e: any | string): void => {
        res.status(403).send({ code: 0, message: "UserVerifyFailed", note: e });
      });
  },
  // 暂未使用
  RegExp: /^[A-Za-z0-9_]{4,20}$/,
  Check(req: JWTRequest, res: Response): void {
    res.send(req.auth);
  },
};

export { User };
