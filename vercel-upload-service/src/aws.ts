import fs from "fs";
import path from "path";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
});

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  
  // CRITICAL: Always use forward slashes for S3 keys
  const s3Key = fileName.replace(/\\/g, '/');
  
  const response = await s3.upload({
    Body: fileContent,
    Bucket: "okkos3",
    Key: s3Key,
  }).promise();
  
  console.log(`Uploaded: ${s3Key}`);
};
