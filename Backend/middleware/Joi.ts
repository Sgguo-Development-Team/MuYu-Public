import { NextFunction, Request, Response } from "express";
import Joi from "joi";

interface Ijoi {
  /**
   * Joi 在 Express 的中间件封装
   */
  middleware: (data: any, content: string) => any;
}

interface Ischemas {
  /**
   * 预定义匹配器
   */
  users: {
    roles: {
      id: Joi.Schema;
      password: Joi.Schema;
    };
  };
  regUsers: {
    roles: {
      email: Joi.Schema;
      password: Joi.Schema;
    };
  };
}

const expressjoi: Ijoi = {
  middleware(data: any, content = "body"): any {
    const schema = Joi.object(data);
    return async (req: any, res: Response, next: NextFunction) => {
      schema
        .validateAsync(req[content], data)
        .then(() => next())
        .catch((err: any) => {
          res.send({
            code: 400,
            message: "键入内容不合法",
            err,
          });
          return; // 终止这一次请求
        });
    };
  },
};

const schemas: Ischemas = {
  users: {
    roles: {
      id: Joi.number().integer().min(1).max(1000).required(),
      password: Joi.string().required(),
    },
  },
  regUsers: {
    roles: {
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
        )
        .required(),
    },
  },
};

export { expressjoi, schemas };
