import config from "./config";
import mysql from "mysql";

export default mysql.createPool(config.db);
