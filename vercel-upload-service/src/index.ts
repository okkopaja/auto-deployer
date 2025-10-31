import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  
  const outputPath = path.join(__dirname, `output/${id}`);
  await simpleGit().clone(repoUrl, outputPath);
  
  const files = getAllFiles(outputPath);
  
  // Upload files sequentially or use Promise.all
  await Promise.all(files.map(async (file) => {
    // Create relative path and normalize to forward slashes
    const relativePath = file.slice(__dirname.length + 1).replace(/\\/g, '/');
    await uploadFile(relativePath, file);
  }));
  
  publisher.lPush("build-queue", id);
  publisher.hSet("status", id, "uploaded");
  
  res.json({
    id: id
  });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response
  });
});

app.listen(3000, () => {
  console.log("Upload service running on port 3000");
});
