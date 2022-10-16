import path from "path";
import createError from "http-errors";
import express from "express";
import logger from "morgan";
import cors from "cors";

// 路由引入
import Service from "./Router/Service";

const app = express();

// 渲染引擎
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "pug");

// 日志
app.use(logger("dev"));

// POST 请求解析器 | Header 设置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req: any, res: any, next: any) => {
  res.setHeader("X-Powered-By", "Sgguo-Development-Team");
  next();
});

// 渲染引擎 - 静态资源

app.use("/templates", express.static(path.join(__dirname, "Views")));
app.use("/", express.static(path.join(__dirname, "Frontend")));
// 开始部署 Routers

app.use(Service);

// 捕获错误并传递给错误处理器
app.use((req: any, res: any, next: any) => {
  next(createError(404));
});

// 部署错误处理器
app.use((err: any, req: any, res: any, next: any) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // 渲染错误
  res
    .status(err.status || 500)
    .render("error", { page: "error", title: "发生致命错误" });
});

app.listen(3100, () => {
  console.log("已部署至 3100 端口");
});
