import { readdir, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const files = (await readdir(root))
  .filter((file) => file.endsWith(".json"))
  .sort();
const errors = [];
const locales = new Map();
const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const tokens = (message) =>
  [
    ...new Set(
      message.replaceAll("$$", "").match(/\$\d+|\$[a-z0-9_]+\$/gi) ?? []
    )
  ]
    .map((token) => token.toLowerCase())
    .sort()
    .join(",");

for (const file of files) {
  try {
    const messages = JSON.parse(await readFile(new URL(file, root), "utf8"));
    if (!isObject(messages) || !Object.keys(messages).length) {
      throw new Error("expected a non-empty object of messages");
    }
    for (const [key, entry] of Object.entries(messages)) {
      if (!/^[a-z0-9_@]+$/i.test(key)) {
        errors.push(`${file}: invalid message key "${key}"`);
      }
      if (
        !isObject(entry) ||
        typeof entry.message !== "string" ||
        !entry.message.trim()
      ) {
        errors.push(`${file}: "${key}" must have a non-empty message`);
      }
    }
    locales.set(file, messages);
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

const source = locales.get("en.json");
if (!source) errors.push("en.json is required");
else {
  for (const [file, messages] of locales) {
    if (file === "en.json") continue;
    for (const [key, entry] of Object.entries(source)) {
      if (!Object.hasOwn(messages, key)) {
        errors.push(`${file}: missing key "${key}"`);
        continue;
      }
      const translated = messages[key];
      if (
        typeof entry?.message === "string" &&
        typeof translated?.message === "string"
      ) {
        if (tokens(entry.message) !== tokens(translated.message)) {
          errors.push(`${file}: "${key}" must preserve message placeholders`);
        }
      }
      if (
        JSON.stringify(entry?.placeholders ?? {}) !==
        JSON.stringify(translated?.placeholders ?? {})
      ) {
        errors.push(`${file}: "${key}" must preserve placeholder definitions`);
      }
    }
    for (const key of Object.keys(messages)) {
      if (!Object.hasOwn(source, key))
        errors.push(`${file}: unknown key "${key}"`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${locales.size} locales (${Object.keys(source).length} messages each).`
  );
}
