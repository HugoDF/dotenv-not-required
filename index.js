console.log(process.env.MY_VAR);

import process from "node:process";
import util from "node:util";

export function programmaticEnvFileLoad() {
  process.loadEnvFile(".env");
}

export function programmaticEnvParsing(text) {
  return util.parseEnv(text);
}
