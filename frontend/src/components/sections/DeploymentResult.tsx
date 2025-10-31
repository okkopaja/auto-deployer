import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CometCard } from "@/components/ui/comet-card";

interface DeploymentResultProps {
  deploymentUrl: string;
  onCopy: () => void;
}

export function DeploymentResult({ deploymentUrl, onCopy }: DeploymentResultProps) {
  return (
    <CometCard
      rotateDepth={6}
      translateDepth={8}
      className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <BackgroundGradient
        className="p-6 bg-gradient-to-br from-zinc-900/95 to-black/95 backdrop-blur-sm rounded-lg"
      >
        {/* Success Icon and Message */}
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-green-500 rounded-full p-2 animate-in zoom-in duration-500 delay-100">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              🚀 Deployment Successful!
            </h3>
            <p className="text-sm text-gray-400">
              Your website is now live and accessible
            </p>
          </div>
        </div>

        {/* URL Section */}
        <div className="space-y-2 mb-4">
          <Label className="text-gray-300">Deployed URL</Label>
          <div className="flex gap-2">
            <Input
              readOnly
              type="url"
              value={deploymentUrl}
              className="bg-black/50 border-yellow-500/30 text-white flex-1"
            />
            <Button
              variant="outline"
              onClick={onCopy}
              className="border-yellow-500/50 text-yellow-400 hover:text-black hover:bg-yellow-500 transition-all duration-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Visit Website Button */}
        <Button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => window.open(deploymentUrl, '_blank')}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Visit Website
        </Button>
      </BackgroundGradient>
    </CometCard>
  );
}
