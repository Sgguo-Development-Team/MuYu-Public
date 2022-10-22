import express from "express";
import { expressjwt, Request as JWTRequest } from "express-jwt";

// 第一方模块
import Analysis from "../Backend/Analysis";
import config from "../config";
import User from "../Backend/User";
import Landing from "../Backend/Landing";

const router: express.Router = express.Router();

// API 服务落地页

router.get("/api", Landing.Render);

// 功德读写

router.route("/api/gunas").get(Analysis.Read).post(Analysis.Write);

// 用户相关

router
  .route("/api/user")
  .get(
    expressjwt({ secret: config.server.secretKey, algorithms: ["HS256"] }),
    (req: JWTRequest, res: express.Response): void => {
      res.send(req.auth);
    }
  )
  .post(User.Login);

export default router;
