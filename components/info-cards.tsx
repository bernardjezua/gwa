import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Award } from "lucide-react"

export default function InfoCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 mt-10">
      <Card className="border-up-maroon-100/60 shadow-xl shadow-up-maroon-900/5 bg-white/90 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-up-maroon-900/10 rounded-2xl group flex flex-col">
        <CardHeader className="bg-gradient-to-r from-up-green-700 to-up-green-600 border-b border-up-green-800/60 pb-5 pt-6 px-6 md:px-8 shadow-inner">
          <CardTitle className="text-xl md:text-2xl font-heading text-white flex items-center gap-3 drop-shadow-sm">
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            GWA Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 flex-grow flex flex-col justify-center">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full relative bg-gray-900 rounded-2xl p-6 md:p-8 mb-6 shadow-inner overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
               {/* Decorative blurs */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-up-maroon-500/20 rounded-full blur-2xl"></div>
               <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-up-green-500/20 rounded-full blur-2xl"></div>
               
               <div className="relative z-10 flex flex-col items-center gap-4">
                 <div className="text-lg sm:text-xl font-mono text-white font-medium tracking-wider text-center flex flex-wrap justify-center items-center gap-1.5 leading-relaxed">
                   <span className="text-up-green-400 font-bold">GWA</span> 
                   <span className="text-gray-400">=</span> 
                   <span className="text-gray-300">∑(</span>
                   <span className="text-up-maroon-300">Grade</span> 
                   <span className="text-gray-400">×</span> 
                   <span className="text-amber-200">Units</span>
                   <span className="text-gray-300">)</span> 
                   <span className="text-gray-400">/</span>
                   <span className="text-gray-300">∑(</span>
                   <span className="text-amber-200">Units</span>
                   <span className="text-gray-300">)</span>
                 </div>
               </div>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center max-w-sm mx-auto">
              The General Weighted Average is calculated by dividing the sum of all grade points (grade multiplied by
              units) by the total number of units.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-up-maroon-100/60 shadow-xl shadow-up-maroon-900/5 bg-white/90 backdrop-blur-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-up-maroon-900/10 rounded-2xl group flex flex-col relative">
        <CardHeader className="bg-gradient-to-r from-up-green-700 to-up-green-600 border-b border-up-green-800/60 pb-5 pt-6 px-6 md:px-8 shadow-inner">
          <CardTitle className="text-xl md:text-2xl font-heading text-white flex items-center gap-3 drop-shadow-sm">
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            Academic Standing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8 flex-grow flex flex-col justify-between">
          <div className="space-y-1 mb-5">
            {[
              { range: "≤ 1.45", label: "University Scholar", color: "bg-amber-500 hover:bg-amber-600", text: "text-white" },
              { range: "> 1.45 & ≤ 1.75", label: "College Scholar", color: "bg-amber-400 hover:bg-amber-500", text: "text-amber-950" },
              { range: "> 1.75 & ≤ 2.00", label: "Honor Roll", color: "bg-up-green-600 hover:bg-up-green-700", text: "text-white" },
              { range: "> 2.00 & ≤ 3.00", label: "Good Standing", color: "bg-blue-600 hover:bg-blue-700", text: "text-white" },
              { range: "> 3.00", label: "Needs Improvement", color: "bg-red-600 hover:bg-red-700", text: "text-white" },
            ].map((standing, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center py-1.5 px-3 md:py-2 md:px-4 rounded-lg hover:bg-gray-50/80 transition-colors border border-transparent hover:border-gray-100"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="font-mono text-sm md:text-[15px] font-semibold text-gray-700 bg-gray-100/80 px-2.5 py-1 rounded-md">{standing.range}</span>
                </div>
                <Badge className={`${standing.color} ${standing.text} transition-colors cursor-default shadow-sm border-0 font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-[6px]`}>
                  {standing.label}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-5 border-t border-gray-100 text-center">
            <p className="text-[13px] text-gray-500/90 leading-relaxed font-medium">
              Academic standings are based on UP's honorific scholarship system 
              <br className="hidden md:block"/> (Revised UP Code, Articles 381-383).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
