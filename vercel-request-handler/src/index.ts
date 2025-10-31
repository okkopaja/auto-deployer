import express from "express";
import { S3 } from "aws-sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
});

const app = express();

app.get("/:id/*", async (req, res) => {
  const id = req.params.id;
  let filePath = req.path.replace(`/${id}`, "") || "/";
  
  if (filePath === "/" || filePath === "" || filePath.endsWith("/")) {
    if (!filePath.endsWith("/")) filePath += "/";
    filePath += "index.html";
  }
  
  // Now we only need forward slash keys since upload service is fixed
  const key = `dist/${id}${filePath}`;
  
  console.log(`Request: id=${id}, path=${filePath}`);
  console.log(`S3 Key: ${key}`);
  
  try {
    const contents = await s3.getObject({
      Bucket: "okkos3",
      Key: key
    }).promise();
    
    const ext = filePath.split(".").pop()?.toLowerCase();
    const contentTypeMap: { [key: string]: string } = {
      "html": "text/html",
      "css": "text/css",
      "js": "application/javascript",
      "mjs": "application/javascript",
      "json": "application/json",
      "png": "image/png",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "svg": "image/svg+xml",
      "ico": "image/x-icon",
      "gif": "image/gif",
      "webp": "image/webp",
      "woff": "font/woff",
      "woff2": "font/woff2",
      "ttf": "font/ttf",
      "eot": "application/vnd.ms-fontobject"
    };
    
    const type = contentTypeMap[ext || ""] || "application/octet-stream";
    res.set("Content-Type", type);
    
    // Rewrite paths in HTML files
    if (ext === "html" && contents.Body) {
      let html = contents.Body.toString("utf-8");
      
      // Rewrite absolute paths in src, href attributes
      html = html.replace(
        /(<(?:script|link|img|source|a)[^>]*(?:src|href)=["'])\/(?!\/)/gi,
        `$1/${id}/`
      );
      
      // Handle inline style urls
      html = html.replace(
        /url\(["']?\/(?!\/)/gi,
        `url('/${id}/`
      );
      
      console.log(`✓ Served (HTML with path rewriting): ${key}`);
      res.send(html);
    }
    // Rewrite paths in JavaScript files (for bundled imports)
    else if ((ext === "js" || ext === "mjs") && contents.Body) {
      let js = contents.Body.toString("utf-8");
      
      // Rewrite asset imports: "/assets/image.png" -> "/5dool/assets/image.png"
      js = js.replace(
        /(["'`])\/(?!\/|https?:\/\/)((?:assets|public|static|images)\/[^"'`]+)(["'`])/gi,
        `$1/${id}/$2$3`
      );
      
      // Handle direct image references: "/vite.svg" -> "/5dool/vite.svg"
      js = js.replace(
        /(["'`])\/((?:[^"'`\/]+\.(?:svg|png|jpg|jpeg|gif|webp|ico)))(["'`])/gi,
        `$1/${id}/$2$3`
      );
      
      console.log(`✓ Served (JS with path rewriting): ${key}`);
      res.send(js);
    }
    // Rewrite paths in CSS files
    else if (ext === "css" && contents.Body) {
      let css = contents.Body.toString("utf-8");
      
      // Rewrite url() references
      css = css.replace(
        /url\(["']?\/(?!\/)/gi,
        `url('/${id}/`
      );
      
      console.log(`✓ Served (CSS with path rewriting): ${key}`);
      res.send(css);
    }
    else {
      console.log(`✓ Served: ${key}`);
      res.send(contents.Body);
    }
  } catch (err: any) {
    if (err.code === "NoSuchKey") {
      console.error(`✗ File not found: ${key}`);
      res.status(404).send(`File not found: ${filePath} for project ${id}`);
    } else {
      console.error(`S3 error for key ${key}:`, err);
      res.status(500).send("Internal server error");
    }
  }
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Vercel Clone - Request Handler</h1>
    <p>Access your deployed projects at: <code>http://localhost:3001/{project-id}/</code></p>
    <p>Example: <a href="http://localhost:3001/5dool/">http://localhost:3001/5dool/</a></p>
  `);
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
  console.log("Access projects: http://localhost:3001/{project-id}/");
  console.log("Example: http://localhost:3001/5dool/");
});
