import { spawn } from "child_process";
import path from "path";
import fs from "fs";

function runViaCmd(cwd: string, cmdline: string, label: string) {
  return new Promise<void>((resolve, reject) => {
    const comspecEnv = process.env.ComSpec;
    const comspec = comspecEnv && fs.existsSync(comspecEnv) ? comspecEnv : "C:\\Windows\\System32\\cmd.exe";
    const child = spawn(comspec, ["/d", "/s", "/c", cmdline], {
      cwd,
      stdio: "inherit",
      windowsHide: true,
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${label} failed with code ${code}`))));
    child.on("error", (err) => reject(err));
  });
}

function runDirect(cwd: string, file: string, args: string[], label: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(file, args, {
      cwd,
      stdio: "inherit",
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${label} failed with code ${code}`))));
    child.on("error", (err) => reject(err));
  });
}

export async function buildProject(id: string) {
  const projectPath = path.join(__dirname, `output/${id}`);
  console.log(`Starting build for project: ${id}`);
  console.log(`Project path: ${projectPath}`);

  if (!fs.existsSync(projectPath)) throw new Error(`Project path not found: ${projectPath}`);
  if (!fs.existsSync(path.join(projectPath, "package.json"))) throw new Error("package.json missing in project");

  if (process.platform === "win32") {
    await runViaCmd(projectPath, "npm install", "npm install");
    await runViaCmd(projectPath, "npm run build", "npm run build");
  } else {
    await runDirect(projectPath, "npm", ["install"], "npm install");
    await runDirect(projectPath, "npm", ["run", "build"], "npm run build");
  }

  console.log("Build completed successfully");
}
