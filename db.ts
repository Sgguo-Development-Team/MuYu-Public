import { config } from "./Config";
import { createPool, Pool } from "mysql";

export const pool: Pool = createPool(config.db);
