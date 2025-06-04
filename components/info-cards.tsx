import { Badge } from "@/components/ui/badge"
import { Calculator, Award } from "lucide-react"

export default function InfoCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="shadow-lg border border-red-200 rounded-xl bg-white overflow-hidden">
        {/* Custom Header */}
        <div className="bg-red-50 px-6 py-6 rounded-t-xl">
          <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            GWA Formula
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="text-xl font-mono bg-gray-100 p-4 rounded-lg border-l-4 border-red-500 mb-4">
              GWA = ∑(Grade × Units) / ∑(Units)
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              The General Weighted Average is calculated by dividing the sum of all grade points (grade multiplied by
              units) by the total number of units.
            </p>
          </div>
        </div>
      </div>

      <div className="shadow-lg border border-red-200 rounded-xl bg-white overflow-hidden">
        {/* Custom Header */}
        <div className="bg-red-50 px-6 py-6 rounded-t-xl">
          <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <Award className="w-5 h-5" />
            UP Academic Standing
          </h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium">≤ 1.45</span>
              <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors cursor-default">
                University Scholar
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">&gt; 1.45 &amp; ≤ 1.75</span>
              <Badge className="bg-yellow-400 text-white hover:bg-yellow-500 transition-colors cursor-default">
                College Scholar
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">&gt; 1.75 &amp; ≤ 2.00</span>
              <Badge className="bg-green-600 text-white hover:bg-green-700 transition-colors cursor-default">
                Honor Roll
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">&gt; 2.00 &amp; ≤ 3.00</span>
              <Badge className="bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-default">
                Good Standing
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">&gt; 3.00</span>
              <Badge className="bg-red-600 text-white hover:bg-red-700 transition-colors cursor-default">
                Needs Improvement
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
