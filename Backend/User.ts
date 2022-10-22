import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { Request as JWTRequest } from "express-jwt";

// 第一方模块
import db from "../db";
import config from "../config";

/**
 * 用户相关功能 - 服务层
 */
interface IUser {
  /**
   * 传字符串加密为 MD5
   * @param str 加密的字符串
   * @returns {string} 加密结果
   */
  getMD5: any;
  /**
   * 测试用户密码信息
   * @param id 用户 ID
   * @param password 密码
   * @returns {Promise} 结果
   */
  Verify: (arg0: any, arg1: any) => Promise<any>;
  /**
   * 登录功能
   * @param req Express.Request
   * @param res Express.Response
   */
  Login: any;
  /**
   * 删除账号
   * @param req Express.Request
   * @param res Express.Response
   */
  Delete: any;
  /**
   * 检测输入合法性
   * @param req Express.Request
   */
  CheckInput: any;
  /**
   * 检测用户名合法性
   */
  RegExp: RegExp | string;
  /**
   * 检测 Token 合法性
   * @param req JWTRequest
   * @param res Express.Response
   */
  Check: any;
}
type Auth = {
  id?: number | string;
  password?: string;
  username?: string;
};
const User: IUser = {
  getMD5(str: string): string {
    return crypto.createHash("md5").update(str).digest("hex");
  },
  Verify(id: number, password: string) {
    const query = `SELECT password FROM league WHERE id = ?`;
    return new Promise<any>((resolve, reject) => {
      db.query(query, [id], (err, result: any): void => {
        // 有错误就抛出
        if (err || result.length !== 1) {
          return reject(
            err ?? "UnknownError || PasswordFailed || UsernameIsSame"
          );
        }
        // 比对
        if (result[0]["password"] === User.getMD5(password)) {
          // 返回
          resolve(password);
        } else {
          reject(false);
        }
      });
    });
  },
  Login(req: Request, res: Response): void {
    const { id, password }: Auth = req.body;
    User.Verify(id, password)
      .then((password: string) => {
        res.status(200).send({
          code: 1,
          token: jwt.sign({ id, password }, config.server.secretKey, {
            algorithm: "HS256",
          }),
        });
      })
      .catch((e: any | string): void => {
        res.status(403).send({ code: 0, message: "LoginFailed", note: e });
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
  CheckInput(req: Request, res: Response, next: NextFunction): any {
    const { id, password }: Auth = req.body;
    if (!id || !password) {
      return res
        .status(400)
        .send({ code: 0, message: "ID or Password are not valid" });
    }
    next();
  },
  RegExp: /^[A-Za-z0-9_]{4,20}$/,
  Check(req: JWTRequest, res: Response): void {
    res.send(req.auth);
  },
};

export default User;
