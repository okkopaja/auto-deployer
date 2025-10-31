export function Hero() {
  return (
    <section className="bg-transparent text-white py-20 px-6">
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-4 animate-in fade-in slide-in-from-top duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          <span className="text-yellow-300 text-sm font-medium">Lightning Fast Deployments</span>
        </div>

        {/* Animated Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom duration-1000">
          Deploy to the Cloud{" "}
          <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            in Seconds
          </span>
        </h1>

        {/* Animated Description */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          Turn your GitHub repository into a live website with just one click. 
          No configuration required.
        </p>
      </div>
    </section>
  );
}
