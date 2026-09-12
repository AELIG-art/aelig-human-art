import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "README.md",
  "CONTRIBUTING.md",
  "docs/ARCHITECTURE-STATUS.md",
  "docs/architecture.md",
  "docs/world-integration.md",
  "docs/infrastructure-and-operations.md",
  "docs/development-and-validation.md",
  "docs/hackathons/ethonline-2026.md",
  "docs/AI-ATTRIBUTION.md",
];

const errors = [];

for (const file of requiredFiles) {
  const absolutePath = path.join(root, file);

  try {
    await access(absolutePath);
  } catch {
    errors.push(`Missing required documentation: ${file}`);
  }
}

const readme = await readFile(path.join(root, "README.md"), "utf8");
for (const target of [
  "docs/architecture.md",
  "docs/ARCHITECTURE-STATUS.md",
  "docs/development-and-validation.md",
  "docs/AI-ATTRIBUTION.md",
]) {
  if (!readme.includes(target)) {
    errors.push(`README.md must link to ${target}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Documentation check passed for ${requiredFiles.length} required files.`);
}
