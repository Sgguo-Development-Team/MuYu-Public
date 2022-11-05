import createError from "http-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "node:http";
import { join as path_join } from "node:path";
import log4js from "log4js";

// 第一方模块
import { Service } from "./Router/Service";
import { config } from "./Config";
import { consoleLogger, logger } from "./Logs";

const app = express();

// 渲染引擎
app.set("views", path_join(__dirname, "Views"));
app.set("view engine", "pug");

// 日志
app.use(
  log4js.connectLogger(logger, {
    level: "auto",
    format: (req: express.Request, _res, format) =>
      format(`:remote-addr :method :status :url ${JSON.stringify(req.body)}`),
  })
);

// POST 请求解析器 | Header 设置

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 渲染引擎 - 静态资源

app.use("/templates", express.static(path_join(__dirname, "Views")));
app.use("/", express.static(path_join(__dirname, "Frontend")));

// 开始部署 Routers

app.use(Service);

// 捕获错误并传递给错误处理器
app.use((_req, _res, next: express.NextFunction): void => {
  next(createError(404));
});

// 部署错误处理器
app.use(
  (err: any, req: express.Request, res: express.Response, _: any): void => {
    (res.locals.message = err.message),
      (res.locals.error = req.app.get("env") === "development" ? err : {});
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
  }
);

createServer(app).listen(config.server.port, () => {
  consoleLogger.debug(
    `Server is running at http://127.0.0.1:${config.server.port}/`
  );
});
