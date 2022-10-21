import path from "path";
import createError from "http-errors";
import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import config from "./config";

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
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  const errorInfo = req.app.get("env") === "development" ? err : {};
  res.locals.error = errorInfo;
  res.format({
    html(): void {
      res
        .status(err.status || 500)
        .render("error", { page: "error", title: "发生致命错误" });
    },
    json(): void {
      res.status(err.status || 500).send(err);
    },
    js(): void {
      res.status(err.status || 500).jsonp(err);
    },
    default(): void {
      res
        .status(406)
        .send("未发现可被接受的 MIME Type, 尝试设置 Resquest 的 HTTP Header");
    },
  });
});

app.listen(config.server.port, () => {
  console.log(`Application running at http://127.0.0.1:${config.server.port}/`);
});
