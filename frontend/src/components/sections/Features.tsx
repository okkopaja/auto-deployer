export function Features() {
  const features = [
    { icon: "⚡", title: "Lightning Fast", description: "Deploy in under 60 seconds" },
    { icon: "🔒", title: "Secure", description: "HTTPS by default" },
    { icon: "🌍", title: "Global CDN", description: "Fast everywhere" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className="bg-zinc-900/30 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6 text-center hover:border-yellow-500/40 hover:bg-zinc-900/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-700"
          style={{ animationDelay: `${(index + 1) * 150}ms` }}
        >
          <div className="text-4xl mb-3 animate-bounce">{feature.icon}</div>
          <div className="text-white font-semibold mb-2">{feature.title}</div>
          <div className="text-gray-400 text-sm">{feature.description}</div>
        </div>
      ))}
    </div>
  );
}
