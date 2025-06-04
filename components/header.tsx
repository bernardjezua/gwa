export default function Header() {
  return (
    <header className="w-full bg-gradient-to-br from-red-900 via-red-800 to-red-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* Logo Icon */}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>

          {/* Title & Tagline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
            UP GWA Calculator
          </h1>
          <p className="text-red-200 max-w-xl text-sm sm:text-base leading-relaxed">
            Need to calculate your GWA? Enter your courses and grades below to get an instant breakdown.
          </p>
        </div>
      </div>
    </header>
  );
}
