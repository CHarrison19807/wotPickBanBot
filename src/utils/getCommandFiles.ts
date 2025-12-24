import fs from "node:fs";
import path from "node:path";

export const getCommandFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return fs
        .readdirSync(fullPath)
        .filter((file) => file.endsWith(".ts"))
        .map((file) => path.join(fullPath, file));
    }

    if (entry.isFile() && entry.name.endsWith(".ts")) {
      return [fullPath];
    }

    return [];
  });
};
