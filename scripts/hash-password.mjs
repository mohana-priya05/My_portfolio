#!/usr/bin/env node
// Generates a bcrypt hash for the ADMIN_PASSWORD_HASH env variable.
//
// Usage:
//   node scripts/hash-password.mjs "your-password"
//
// Copy the printed hash into .env.local as ADMIN_PASSWORD_HASH.
// Required dependency: bcryptjs (installed).

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters long.");
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(password, 12);
  console.log(hash);
  console.log("\nAdd this to .env.local as:");
  console.log("ADMIN_PASSWORD_HASH=" + hash);
} catch (error) {
  console.error("Failed to hash password:", error);
  process.exit(1);
}