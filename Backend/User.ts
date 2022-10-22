import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request, Response } from "express";

// 第一方模块
import db from "../db";
import config from "../config";

type LoginQueryResult = {
  /**
   * 用户密码
   */
  [0]: {
    password: string;
  };
};
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
   * 登录功能
   * @param req Express.Request
   * @param res Express.Response
   */
  Login: any;
}
const User: IUser = {
  getMD5(str: string): string {
    return crypto.createHash("md5").update(str).digest("hex");
  },
  Login(req: Request, res: Response): void {
    const { id, password } = req.body;
    const query = `SELECT password FROM league WHERE id = ?`;
    db.query(query, [id], (err, result: LoginQueryResult): void => {
      // 有错误就抛出
      if (err) throw err;
      // 比对
      if (result[0]["password"] === User.getMD5(password)) {
        // 返回
        res.status(200).send({
          code: 1,
          token: jwt.sign({ id }, config.server.secretKey, {
            algorithm: "HS256",
          }),
        });
      } else {
        res.status(403).send({ code: 0, message: "Login failed" });
      }
    });
  },
};

export default User;
