import { sign as jwt_sign } from "jsonwebtoken";
import { Request, Response } from "express";
import { Request as JWTRequest } from "express-jwt";
import { compare as bcrypt_compare, hash as bcrypt_hash } from "bcryptjs";

// 第一方模块

import { pool as db } from "../DB";
import { config } from "../Config";

/**
 * 用户相关功能 - 服务层
 */
interface IUser {
  /**
   * 验证信息, 搭配 trycatch 失败后可以便捷处理 err
   * @example
   * ```ts
   * app.get("/api/checkUser", (req,res) => {
   *  res.send(await User.Verify(id,password));
   * })
   * ```
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
  Login: (req: Request, res: Response) => Promise<void>;
  /**
   * 删除账号
   * @param req Express.Request
   * @param res Express.Response
   */
  Delete: (req: Request, res: Response) => void;
  /**
   * 注册账号
   * @param req Express.Request
   * @param res Express.Response
   */
  Reg: (req: Request, res: Response) => Promise<void>;
  /**
   * 检测 Token 合法性
   * @param req JWTRequest
   * @param res Express.Response
   */
  Check: (req: JWTRequest, res: Response) => void;
  /**
   * 检测邮箱是否存在
   */
  isExist: (email: string) => Promise<any | boolean>;
}
interface IAuth {
  id?: number | string;
  password?: string;
  username?: string;
}

export const User: IUser = {
  Verify(id, password: any): Promise<any> {
    const query = `SELECT password FROM league WHERE id = ?`;
    return new Promise<any>((resolve, reject) => {
      db.query(query, [id], async (err, result: any) => {
        // 有错误就抛出
        if (err) {
          reject(err ?? "UnknownError");
          return;
        }
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
        } catch (err: any) {
          reject({
            info: `ID ${id}: NotExist.`,
            err,
          });
        }
      });
    });
  },
  async Login(req, res): Promise<void> {
    try {
      const { id, password }: IAuth = req.body,
        result = await User.Verify(id, password);
      result.status
        ? res.status(200).send({
            code: 1,
            message: result.msg,
            token: jwt_sign({ id, password }, config.server.secretKey, {
              algorithm: "HS256",
              expiresIn: 1000 * 60 * 24 * 7,
            }),
          })
        : res.status(403).send({ code: 0, message: result.msg });
    } catch (err: any) {
      res.status(502).send({ code: 0, message: "LoginFailed", err });
    }
  },
  async Delete(req, res): Promise<void> {
    try {
      const { id, password }: IAuth = req.body,
        query = `DELETE FROM league WHERE id = ?`;
      await User.Verify(id, password); // 验证用户
      db.query(query, [id], (err): void => {
        if (err) throw err;
        res.status(200).send({ code: 1, message: "DeleteSuccessful" });
      });
    } catch (error: any) {
      res
        .status(403)
        .send({ code: 0, message: "UserVerifyFailed", err: error });
    }
  },
  async Reg(req, res): Promise<void> {
    const { email, password } = req.body,
      query = `INSERT INTO league (email, gunas, password) VALUES (?, '1', ?);`;
    try {
      const isExist = await User.isExist(email);
      if (!isExist) {
        db.query(
          query,
          [email, await bcrypt_hash(password, 10)],
          (err, result) => {
            if (err) throw { info: "DatabaseError", err }; // 终止
            res.status(200).send({
              code: 1,
              message: "RegUserSuccess",
              token: jwt_sign(
                { id: result.insertId },
                config.server.secretKey,
                {
                  algorithm: "HS256",
                  expiresIn: 1000 * 60 * 24 * 7,
                }
              ),
              result: result,
            }); // 没有问题直接返回
          }
        );
      } else throw { info: "emailExist", isExist: [email, isExist] };
    } catch (error: any) {
      res.status(500).send({ code: 0, message: "RegError", err: error });
    }
  },
  Check(req, res): void {
    res
      .status(200)
      .send({ code: 1, message: "GetTokenInfoSuccess", auth: req.auth });
  },
  isExist(email) {
    return new Promise<any | boolean>((resolve, reject) => {
      db.query(
        `SELECT * FROM league WHERE email = ?`,
        [email],
        (err, reuslts: Array<any>) => {
          if (err) {
            reject({ info: "DatabaseError in Check e-mail.", err });
            return;
          }
          resolve(reuslts.length >= 1);
        }
      );
    });
  },
};
