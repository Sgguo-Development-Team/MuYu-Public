/**
 * 数据库默认类型定义
 * @param servername 服务器地址
 * @param username 用户名
 * @param port 端口
 */
enum dbConfigDefault {
  servername = "localhost",
  username = "root",
  port = 3306,
}
/**
 * 数据库默认类型定义
 * @param port 端口
 */
enum serverConfigDefault {
  port = 5100,
}
interface IserverConfig {
  /**
   * 服务器运行端口号
   */
  port: number | serverConfigDefault;
}
interface IdbConfig {
  /**
   * 数据库地址
   */
  servername: string | dbConfigDefault;
  /**
   * 数据库用户名
   */
  username: string | dbConfigDefault;
  /**
   * 数据库
   */
  dbname: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 端口
   */
  port?: number | dbConfigDefault;
}
interface Iconfig {
  /**
   * 服务器配置总和如下调用
   * ```ts
   * import config from "./config"
   * // 省略 Express 配置
   * app.listen(config.server.port)
   * ```
   */
  server: IserverConfig;
  /**
   * 数据库配置
   */
  db: IdbConfig;
}
/**
 * Appliaction 运行配置信息，{@link Iconfig}
 */
const appConfig: Iconfig = {
  /**
   * 服务器配置信息
   * 接口配置：{@link IserverConfig}
   */
  server: {
    port: 5100,
  },
  /**
   * 数据库
   * 接口配置：{@link IdbConfig}
   */
  db: {
    servername: dbConfigDefault.servername,
    username: dbConfigDefault.username,
    dbname: "root",
    password: "123456",
    port: dbConfigDefault.port,
  },
};

export default appConfig;
