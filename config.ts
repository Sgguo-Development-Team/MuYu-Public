/**
 * 数据库默认类型定义
 * @param servername 服务器地址
 * @param username 用户名
 * @param port 端口
 */
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
  /**
   * JWT 密钥
   */
  secretKey: string;
}
interface IdbConfig {
  /**
   * 数据库地址
   */
  host: string;
  /**
   * 数据库用户名
   */
  user: string;
  /**
   * 数据库
   */
  database: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 端口
   */
  port?: number;
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
    secretKey:
      "Sgguo-Development-Team is BESTTTTTTTTTTTTT. SHARPPPPPPPPPPP KEY!",
  },
  /**
   * 数据库
   * 接口配置：{@link IdbConfig}
   */
  db: {
    host: "localhost",
    user: "root",
    database: "muyu",
    password: "RootDBUser",
    port: 3306,
  },
};

export default appConfig;
