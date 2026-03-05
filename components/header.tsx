export default function Header() {
  return (
    <header className="w-full relative overflow-hidden bg-up-maroon-800 text-white shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[50%] -right-[10%] w-[70%] h-[150%] rounded-full bg-gradient-to-br from-up-maroon-600/40 to-up-maroon-900/10 blur-3xl transform rotate-12" />
        <div className="absolute -bottom-[50%] -left-[10%] w-[60%] h-[150%] rounded-full bg-gradient-to-tr from-up-maroon-900/40 to-up-maroon-700/10 blur-3xl transform -rotate-12" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-5">
          {/* Logo & Title */}
          <div className="flex items-center gap-4 md:gap-5">
            <div className="bg-white/10 backdrop-blur-md p-3 md:p-3.5 rounded-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <img src="/favicon.png" alt="UP GWA Calculator Logo" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md" />
            </div>
            
            <div className="flex flex-col gap-0.5 md:gap-1">
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                UP GWA Calculator
              </h1>
              <p className="text-up-maroon-100 text-xs sm:text-sm md:text-base font-medium opacity-90 tracking-wide">
                Calculate your General Weighted Average effortlessly.
              </p>
            </div>
          </div>

          <div className="hidden lg:block max-w-[280px] text-sm text-up-maroon-100 opacity-80 leading-relaxed text-right font-medium">
            Enter your courses, units, and grades to get an instant breakdown.
          </div>
        </div>
      </div>
      
      {/* Bottom accent border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-up-green-500 via-up-green-400 to-up-green-600"></div>
    </header>
  );
}
