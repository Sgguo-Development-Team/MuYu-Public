import express from "express";
import { expressjwt } from "express-jwt";

// 第一方模块
import { Analysis } from "../Backend/Analysis";
import { config } from "../Config";
import { User } from "../Backend/User";
import { Landing } from "../Backend/Landing";
import { expressJoi, schemas } from "../Backend/middleware/Joi";

const router: express.Router = express.Router();

// API 服务落地页

router.get("/api", Landing.Render);

// 功德读写

router.route("/api/gunas").get(Analysis.Read).put(Analysis.Write);

// 用户相关

router
  .route("/api/user")
  .get(
    expressJoi.middleware(schemas.check.roles),
    expressjwt({
      secret: config.server.secretKey,
      algorithms: ["HS256"],
      getToken: (req: express.Request) => req.body.auth,
    }),
    User.Check
  )
  .put(expressJoi.middleware(schemas.regUsers.roles), User.Reg)
  .post(expressJoi.middleware(schemas.users.roles), User.Login)
  .delete(expressJoi.middleware(schemas.users.roles), User.Delete);

export { router as Service };
