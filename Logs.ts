import log4js from "log4js";

export const loggerConfig: log4js.Log4js = log4js.configure({
    appenders: {
      console: { type: "console" },
      app: {
        type: "DateFile",
        filename: "Logs/app",
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        maxLogSize: 10485760,
        compress: true,
      },
      file: {
        type: "DateFile",
        filename: "Logs/report",
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        maxLogSize: 10485760,
        compress: true,
      },
    },
    categories: {
      console: { appenders: ["console", "app"], level: "ALL" },
      default: { appenders: ["console", "file"], level: "INFO" },
    },
  }),
  logger: log4js.Logger = loggerConfig.getLogger(),
  consoleLogger: log4js.Logger = loggerConfig.getLogger("console");
