interface DeploymentStatusProps {
  status: "uploading" | "building" | "deployed" | null;
  uploadId?: string;
}

export function DeploymentStatus({ status, uploadId }: DeploymentStatusProps) {
  if (!status) return null;

  return (
    <div className="space-y-3 p-6 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-yellow-500/20 animate-in fade-in slide-in-from-bottom duration-500">
      {/* Uploading Step */}
      <div className="flex items-center gap-3 group">
        <div className={`h-3 w-3 rounded-full transition-all duration-500 ${
          status === 'uploading' 
            ? 'bg-yellow-500 animate-pulse scale-110' 
            : status === 'building' || status === 'deployed'
            ? 'bg-green-500 animate-in zoom-in duration-300'
            : 'bg-gray-600'
        }`}></div>
        <span className="text-sm text-gray-300 flex-1">Uploading files</span>
        {(status === 'building' || status === 'deployed') && (
          <span className="text-green-500 ml-auto animate-in fade-in zoom-in duration-300">✓</span>
        )}
      </div>

      {/* Building Step */}
      <div className="flex items-center gap-3 group">
        <div className={`h-3 w-3 rounded-full transition-all duration-500 ${
          status === 'building' 
            ? 'bg-yellow-500 animate-pulse scale-110' 
            : status === 'deployed'
            ? 'bg-green-500 animate-in zoom-in duration-300'
            : 'bg-gray-600'
        }`}></div>
        <span className="text-sm text-gray-300 flex-1">
          {status === 'building' && uploadId && (
            <span className="flex items-center gap-2">
              Building <span className="text-yellow-400">{uploadId}</span>
              <svg className="animate-spin h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
          {status !== 'building' && 'Building project'}
        </span>
        {status === 'deployed' && (
          <span className="text-green-500 ml-auto animate-in fade-in zoom-in duration-300">✓</span>
        )}
      </div>

      {/* Deployment Complete Step */}
      <div className="flex items-center gap-3 group">
        <div className={`h-3 w-3 rounded-full transition-all duration-500 ${
          status === 'deployed' 
            ? 'bg-green-500 animate-in zoom-in duration-500 scale-110' 
            : 'bg-gray-600'
        }`}></div>
        <span className="text-sm text-gray-300 flex-1">Deployment complete</span>
        {status === 'deployed' && (
          <span className="text-green-500 ml-auto animate-in fade-in zoom-in duration-300">✓</span>
        )}
      </div>
    </div>
  );
}
