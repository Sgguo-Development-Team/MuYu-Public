import { Response, NextFunction } from "express";
import Joi from "joi";

interface Ijoi {
  /**
   * Joi 中间件函数
   * @param roles Joi 校验规则
   * @param content 校验内容所在路径 (基于 req)
   * @returns 中间件函数
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
  check: {
    roles: {
      auth: Joi.Schema;
    };
  };
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
  gunas: {
    roles: {
      auth: Joi.Schema;
      gunas: Joi.Schema;
    };
  };
}

export const expressJoi: Ijoi = {
    middleware(roles, content = "body"): any {
      const schema = Joi.object(roles);
      return (req: any, res: Response, next: NextFunction): void => {
        schema
          .validateAsync(req[content], roles)
          .then(() => next())
          .catch((err: any) => {
            res.status(400).send({
              code: 400,
              message: "请求内容已被截下",
              err,
            });
            return; // 终止这一次请求
          });
      };
    },
  },
  schemas: Ischemas = {
    check: {
      roles: {
        auth: Joi.string().required(),
      },
    },
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
          .pattern(/^[a-zA-Z0-9_-]{4,16}$/)
          .required(),
      },
    },
    gunas: {
      roles: {
        auth: Joi.string().required(),
        gunas: Joi.number().integer().min(1).required(),
      },
    },
  };
