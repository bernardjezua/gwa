export default function Header() {
  return (
    <header className="w-full bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* Logo Icon */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-md">
            <img src="/favicon.png" alt="UP GWA Calculator Logo" className="w-16 h-16" />
          </div>

          {/* Title & Tagline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
            UP GWA Calculator
          </h1>
          <p className="text-red-200 max-w-xl text-sm sm:text-base leading-relaxed">
            Need to calculate your GWA for the semester? Enter your courses and grades below to get an instant breakdown.
          </p>
        </div>
      </div>
    </header>
  );
}
