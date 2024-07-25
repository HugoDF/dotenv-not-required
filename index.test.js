import { beforeEach, test, mock } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

beforeEach(() => {
  delete process.env.MY_VAR;
});

test("log vars - undefined", async () => {
  const log = mock.method(console, "log");
  log.mock.mockImplementation(() => {});
  await import("./index.js?var-undefined");
  assert.equal(log.mock.callCount(), 1);
  assert.deepEqual(log.mock.calls[0].arguments, [undefined]);
});

test("log vars - set", async () => {
  const log = mock.method(console, "log");
  process.env.MY_VAR = "TEST_123";
  log.mock.mockImplementation(() => {});
  await import("./index.js?var-set");
  assert.equal(log.mock.callCount(), 1);
  assert.deepEqual(log.mock.calls[0].arguments, ["TEST_123"]);
});

test("script with --env-file", () => {
  const output = spawnSync("node", ["--run", "start:native"]);
  assert.ok(output.output.toString().includes("from-env-file"));
});

test("script with -r dotenv/config", () => {
  const output = spawnSync("node", ["--run", "start:dotenv"]);
  assert.ok(output.output.toString().includes("from-env-file"));
});

import process from "node:process";

test("programmatic - native - load from file", () => {
  delete process.env.MY_VAR;
  process.loadEnvFile(".env");
  assert.equal(process.env.MY_VAR, "from-env-file");
});

import util from "node:util";

test("programmatic - native - parse from string ", () => {
  assert.deepEqual(util.parseEnv("MY_VAR=my-value"), {
    MY_VAR: "my-value",
  });
});

import dotenv from "dotenv";

test("programmatic - dotenv - load from file", () => {
  delete process.env.MY_VAR;
  dotenv.config();
  assert.equal(process.env.MY_VAR, "from-env-file");
});

test("programmatic - dotenv - parse from string", () => {
  assert.deepEqual(dotenv.parse("MY_VAR=my-value"), {
    MY_VAR: "my-value",
  });
});
