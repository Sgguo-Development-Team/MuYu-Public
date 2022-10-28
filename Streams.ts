import { createWriteStream, WriteStream } from "node:fs";
import { join as path_join } from "node:path";

const nowTime: Date = new Date();

const logsWriteStream: WriteStream = createWriteStream(
  path_join(
    __dirname,
    `Logs/report-${nowTime.getFullYear()}-${nowTime.getMonth()}-${nowTime.getDate()}.log`
  ),
  { encoding: "utf-8", flags: "a" }
);

export { logsWriteStream };
