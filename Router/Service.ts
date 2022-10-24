import express from "express";
import { expressjwt } from "express-jwt";

// 第一方模块
import Analysis from "../Backend/Analysis";
import config from "../config";
import { User } from "../Backend/User";
import Landing from "../Backend/Landing";

console.log(User);

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
  .post(User.CheckInput, User.Login)
  .delete(User.CheckInput, User.Delete);

export default router;
