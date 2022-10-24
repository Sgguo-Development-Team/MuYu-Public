import { Response } from "express";

interface ILanding {
  /**
   * 渲染落地页
   */
  Render: (_: any, res: Response) => void;
}

const Landing: ILanding = {
  Render(_: any, res: Response): void {
    res.render("service", {
      page: "landing",
      title: "电子木鱼 - API 服务",
      text: "电子木鱼 Project & Powered by Sgguo-Development-Team",
    });
  },
};

export default Landing;
