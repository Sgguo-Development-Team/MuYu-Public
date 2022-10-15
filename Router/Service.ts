import Analysis from "../Backend/Analysis";
import express from "express";
const router: any = express.Router();

// API 服务
router.get("/api", (req: any, res: any) => {
  res.render("service", {
    page: "landing",
    title: "电子木鱼 - API 服务",
    text: "电子木鱼 Project & Powered by Sgguo-Development-Team",
  });
});

router.post("/api/info", (req: any, res: any) => {
  Analysis.Write();
  res.send("Debugger");
});

router.get("/api/info", (req: any, res: any) => {
  res.send(Analysis.Read());
});

export default router;
