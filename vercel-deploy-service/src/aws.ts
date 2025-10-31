import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
});

// -------------------- helpers --------------------

async function listAllKeys(bucket: string, prefix: string): Promise<string[]> {
  const acc: string[] = [];
  let token: string | undefined = undefined;

  do {
    const resp = await s3.listObjectsV2({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: token
    }).promise();

    const contents = resp.Contents || [];
    for (const o of contents) {
      if (!o.Key) continue;
      const key = String(o.Key);
      // Skip S3 folder markers
      if (key.endsWith("/")) continue;
      acc.push(key);
    }

    token = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (token);

  return acc;
}

async function writeBody(outPath: string, body: S3.Body | undefined) {
  let data: Uint8Array;

  if (body == null) {
    data = new Uint8Array();
  } else if (Buffer.isBuffer(body)) {
    data = new Uint8Array(body.buffer, body.byteOffset, body.byteLength);
  } else if (typeof body === "string") {
    data = new TextEncoder().encode(body);
  } else if (body instanceof Uint8Array) {
    data = body;
  } else {
    // Stream handling
    const chunks: Uint8Array[] = [];
    const stream = body as NodeJS.ReadableStream;
    await new Promise<void>((resolve, reject) => {
      stream.on("data", (chunk) => {
        if (chunk instanceof Uint8Array) chunks.push(chunk);
        else if (Buffer.isBuffer(chunk)) chunks.push(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
        else if (typeof chunk === "string") chunks.push(new TextEncoder().encode(chunk));
        else chunks.push(new Uint8Array(chunk));
      });
      stream.on("end", () => resolve());
      stream.on("error", (err) => reject(err));
    });
    
    let total = 0;
    for (const c of chunks) total += c.byteLength;
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.byteLength;
    }
    data = merged;
  }

  await fs.promises.writeFile(outPath, data);
}

function getAllFiles(root: string): string[] {
  let result: string[] = [];
  const entries = fs.readdirSync(root);
  for (const entry of entries) {
    const full = path.join(root, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) result = result.concat(getAllFiles(full));
    else result.push(full);
  }
  return result;
}

async function uploadFile(key: string, localFilePath: string) {
  const Body = fs.readFileSync(localFilePath);
  // Ensure S3 keys always use forward slashes
  const normalizedKey = key.replace(/\\/g, "/");
  
  const res = await s3.upload({
    Bucket: "okkos3",
    Key: normalizedKey,
    Body
  }).promise();
  
  console.log(`Uploaded: ${normalizedKey}`);
}

// -------------------- public API --------------------

export async function downloadS3Folder(prefix: string) {
  const bucket = "okkos3";
  // Normalize prefix to forward slashes
  const normalizedPrefix = prefix.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+$/, "");
  const baseOutDir = path.join(__dirname, normalizedPrefix);
  
  if (!fs.existsSync(baseOutDir)) {
    fs.mkdirSync(baseOutDir, { recursive: true });
  }

  console.log(`Downloading from S3 prefix: ${normalizedPrefix}`);
  
  const keys = await listAllKeys(bucket, normalizedPrefix + "/");
  
  if (!keys.length) {
    console.warn(`No objects found for prefix: ${normalizedPrefix}/`);
    return;
  }

  console.log(`Found ${keys.length} files to download`);

  let count = 0;
  await Promise.all(keys.map(async (key) => {
    // Strip the prefix to get relative path
    const relativePath = key.startsWith(normalizedPrefix + "/") 
      ? key.slice(normalizedPrefix.length + 1) 
      : key;
    
    const outPath = path.join(baseOutDir, relativePath);
    const dir = path.dirname(outPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const obj = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    await writeBody(outPath, obj.Body);
    count++;
  }));

  console.log(`Downloaded ${count} files to ${baseOutDir}`);
}

export function copyFinalDist(id: string) {
  const candidates = [
    path.join(__dirname, `output/${id}/dist`),
    path.join(__dirname, `output/${id}/build`),
    path.join(__dirname, `output/${id}/out`)
  ];
  
  const folderPath = candidates.find(p => fs.existsSync(p));
  
  if (!folderPath) {
    throw new Error(`Build output not found. Tried: ${candidates.join(", ")}`);
  }

  const files = getAllFiles(folderPath);
  
  if (files.length === 0) {
    throw new Error(`Build output is empty at: ${folderPath}`);
  }

  console.log(`Uploading ${files.length} files from ${folderPath}`);
  
  files.forEach(file => {
    // Get relative path and normalize to forward slashes
    const relativePath = file.slice(folderPath.length + 1).replace(/\\/g, "/");
    uploadFile(`dist/${id}/${relativePath}`, file);
  });
}
