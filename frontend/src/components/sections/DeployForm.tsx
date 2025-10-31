import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CometCard } from "@/components/ui/comet-card";

interface DeployFormProps {
  repoUrl: string;
  onRepoUrlChange: (url: string) => void;
  onDeploy: () => void;
  uploading: boolean;
  deployed: boolean;
}

export function DeployForm({ repoUrl, onRepoUrlChange, onDeploy, uploading, deployed }: DeployFormProps) {
  const isValidUrl = repoUrl && repoUrl.includes('github.com');

  return (
    <CometCard
      rotateDepth={6}
      translateDepth={8}
      className="animate-in fade-in slide-in-from-bottom duration-700 delay-300"
    >
      <BackgroundGradient 
        className="rounded-lg p-8 bg-zinc-900/90 backdrop-blur-sm"
      >
        <h2 className="text-2xl font-semibold text-white mb-6">
          Deploy Your Repository
        </h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="github-url" className="text-gray-200">
              GitHub Repository URL
            </Label>
            <div className="relative">
              <Input
                id="github-url"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => onRepoUrlChange(e.target.value)}
                disabled={uploading || deployed}
                className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:ring-yellow-500/20 pr-10 transition-all duration-300"
              />
              {isValidUrl && (
                <svg 
                  className="absolute right-3 top-3 h-5 w-5 text-green-500 animate-in fade-in zoom-in duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              )}
            </div>
          </div>

          <Button
            onClick={onDeploy}
            disabled={!repoUrl || uploading || deployed}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold py-6 text-lg shadow-lg shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deploying...
              </span>
            ) : deployed ? (
              "Deployed Successfully ✓"
            ) : (
              "Deploy Now"
            )}
          </Button>
        </div>
      </BackgroundGradient>
    </CometCard>
  );
}
