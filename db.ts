import config from "./Config";
import { createPool, Pool } from "mysql";

const pool: Pool = createPool(config.db);

export default pool;
