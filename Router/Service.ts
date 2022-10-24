import express from "express";
import { expressjwt } from "express-jwt";

// 第一方模块
import Analysis from "../Backend/Analysis";
import config from "../config";
import { User } from "../Backend/User";
import Landing from "../Backend/Landing";
import { expressjoi, schemas } from "../Backend/middleware/Joi";

const router: express.Router = express.Router();

// API 服务落地页

router.get("/api", Landing.Render);

// 功德读写

router.route("/api/gunas").get(Analysis.Read).put(Analysis.Write);

// 用户相关

router
  .route("/api/user")
  .get(
    expressjwt({ secret: config.server.secretKey, algorithms: ["HS256"] }),
    User.Check
  )
  .post(expressjoi.middleware(schemas.users.roles, "body"), User.Login)
  .delete(expressjoi.middleware(schemas.users.roles, "body"), User.Delete);

export default router;
