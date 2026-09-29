import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeUrl } from "./url";

test("normalizeUrl", () => {
  assert.equal(normalizeUrl("example.com"), "https://example.com/");
  assert.equal(normalizeUrl("  http://a.io/x?y=1 "), "http://a.io/x?y=1");
  assert.equal(normalizeUrl("mailto:me@a.io"), "mailto:me@a.io");
  assert.equal(normalizeUrl("javascript:alert(1)"), null);
  assert.equal(normalizeUrl("data:text/html,hi"), null);
  assert.equal(normalizeUrl("hello"), null);
  assert.equal(normalizeUrl(""), null);
});
