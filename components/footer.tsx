import Link from "next/link"
import { Globe, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full mt-auto relative bg-white/80 backdrop-blur-md border-t border-gray-200/80 overflow-hidden">
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-up-maroon-200 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Branding & Signature */}
        <div className="flex items-center text-sm md:text-base text-gray-500 gap-1.5 flex-wrap justify-center sm:justify-start">
          <span className="font-semibold text-gray-400 uppercase tracking-widest text-[10px] md:text-xs mr-2 border-r border-gray-300 pr-3">UP GWA CALCULATOR</span>
          Developed with <Heart className="w-4 h-4 text-up-maroon-600 fill-up-maroon-600 animate-pulse" /> by 
          <span className="font-bold text-gray-800 tracking-wide">Bernard Jezua</span>
        </div>

        {/* Action Link */}
        <Link 
          href="https://bernardjezua.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 text-gray-600 hover:text-up-green-700 transition-all duration-300 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-up-green-300 hover:-translate-y-0.5 group w-auto"
        >
          <div className="bg-gray-100 p-1 rounded-full text-gray-500 group-hover:bg-up-green-100 group-hover:text-up-green-600 transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-xs md:text-sm mr-1">Feel free to reach out here!</span>
        </Link>

      </div>
    </footer>
  )
}


