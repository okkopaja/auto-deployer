import { useState } from "react";
import axios from "axios";
import { Hero } from "@/components/sections/Hero";
import { DeployForm } from "@/components/sections/DeployForm";
import { DeploymentStatus } from "@/components/sections/DeploymentStatus";
import { DeploymentResult } from "@/components/sections/DeploymentResult";
import { Features } from "@/components/sections/Features";

const BACKEND_UPLOAD_URL = "http://localhost:3000";
const DEPLOYMENT_URL = "http://localhost:3001";

export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<"uploading" | "building" | "deployed" | null>(null);

  const handleDeploy = async () => {
    setUploading(true);
    setDeploymentStatus("uploading");

    try {
      const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
        repoUrl: repoUrl
      });

      setUploadId(res.data.id);
      setDeploymentStatus("building");

      const interval = setInterval(async () => {
        const response = await axios.get(`${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`);
        
        if (response.data.status === "deployed") {
          clearInterval(interval);
          setDeploymentStatus("deployed");
          setDeployed(true);
          setUploading(false);
        }
      }, 3000);

    } catch (error) {
      console.error("Deployment failed:", error);
      setUploading(false);
      setDeploymentStatus(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${DEPLOYMENT_URL}/${uploadId}`);
  };

  return (
    <div className="min-h-screen">  {/* NO background classes here */}
      <Hero />

      <main className="max-w-4xl mx-auto px-6 py-12 pb-20 space-y-8">
        <DeployForm
          repoUrl={repoUrl}
          onRepoUrlChange={setRepoUrl}
          onDeploy={handleDeploy}
          uploading={uploading}
          deployed={deployed}
        />

        <DeploymentStatus status={deploymentStatus} uploadId={uploadId} />

        {deployed && (
          <DeploymentResult
            deploymentUrl={`${DEPLOYMENT_URL}/${uploadId}/`}
            onCopy={copyToClipboard}
          />
        )}

        <Features />
      </main>
    </div>
  );
}