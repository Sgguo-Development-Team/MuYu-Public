import { Response, NextFunction } from "express";
import Joi from "joi";

interface Ijoi {
  /**
   * Express-Joi 封装
   * @return {object} 中间件函数
   * @param roles 规则
   * @param content 内容路径
   */
  middleware: (
    roles: any,
    content?: string
  ) => (req: any, res: Response, next: NextFunction) => void;
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

const expressJoi: Ijoi = {
  middleware(roles: any, content = "body"): any {
    const schema = Joi.object(roles);
    return (req: any, res: Response, next: NextFunction): void => {
      schema
        .validateAsync(req[content], roles)
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

export { expressJoi, schemas };
