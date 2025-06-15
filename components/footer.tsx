export default function Footer() {
  return (
    <div className="text-center mt-12 py-8 border-t border-gray-200">
      <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2">
        Academic standings are based on UP's honorific scholarship system (Revised UP Code, Articles 381-383).
      </p>
      <p className="text-sm sm:text-base md:text-md text-gray-500">
        Developed by{' '}
        <a 
          href="https://bernardjezua.vercel.app" 
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-semibold underline"
        >
          @bernardjezua
        </a> 
        {/* spacer */} / 
        For suggestions/concerns, email me at{' '}
        <a 
          href="mailto:bernardjezuaml@gmail.com" 
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300 font-semibold underline"
        >
          bernardjezuaml@gmail.com
        </a>.
      </p>
    </div>
  )
}
