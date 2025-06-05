import { Badge } from "@/components/ui/badge"
import { Award, Star, Trophy, Medal, TrendingUp } from "lucide-react"
import type { Subject } from "./gwa-calculator"

interface ResultsCardProps {
  gwa: number
  totalUnits: number
  validSubjects: Subject[]
}

export default function ResultsCard({ gwa, totalUnits, validSubjects }: ResultsCardProps) {
  const getAcademicStanding = (gwa: number) => {
    if (gwa <= 1.45)
      return {
        status: "University Scholar",
        color: "bg-yellow-500 text-white hover:bg-yellow-600",
        icon: Trophy,
        headerGradient: "from-yellow-500 to-yellow-400",
        circleGradient: "from-yellow-100 to-yellow-200",
        textColor: "text-yellow-900",
        statsBackground: "bg-yellow-50",
        statsTextColor: "text-yellow-900",
      }
    if (gwa > 1.45 && gwa <= 1.75)
      return {
        status: "College Scholar",
        color: "bg-yellow-400 text-white hover:bg-yellow-500",
        icon: Medal,
        headerGradient: "from-yellow-400 to-yellow-300",
        circleGradient: "from-yellow-100 to-orange-100",
        textColor: "text-yellow-800",
        statsBackground: "bg-yellow-50",
        statsTextColor: "text-yellow-800",
      }
    if (gwa > 1.75 && gwa <= 2.0)
      return {
        status: "Honor Roll",
        color: "bg-green-600 text-white hover:bg-green-700",
        icon: Star,
        headerGradient: "from-green-600 to-green-500",
        circleGradient: "from-green-100 to-green-200",
        textColor: "text-green-900",
        statsBackground: "bg-green-50",
        statsTextColor: "text-green-900",
      }
    if (gwa <= 3.0)
      return {
        status: "Good Standing",
        color: "bg-blue-600 text-white hover:bg-blue-700",
        icon: Award,
        headerGradient: "from-blue-600 to-blue-500",
        circleGradient: "from-blue-100 to-blue-200",
        textColor: "text-blue-900",
        statsBackground: "bg-blue-50",
        statsTextColor: "text-blue-900",
      }
    return {
      status: "Needs Improvement",
      color: "bg-red-600 text-white hover:bg-red-700",
      icon: Award,
      headerGradient: "from-red-600 to-red-500",
      circleGradient: "from-red-100 to-red-200",
      textColor: "text-red-900",
      statsBackground: "bg-red-50",
      statsTextColor: "text-red-900",
    }
  }

  // Get performance insights
  const getPerformanceInsights = () => {
    if (validSubjects.length === 0) return null

    const subjectsWithNames = validSubjects.filter((s) => s.name.trim() !== "")
    if (subjectsWithNames.length === 0) return null

    // Check if there's significant grade variation (difference > 0.5)
    const grades = subjectsWithNames.map((s) => s.grade)
    const minGrade = Math.min(...grades)
    const maxGrade = Math.max(...grades)
    const hasVariation = maxGrade - minGrade > 0.5

    let bestSubject
    let worstSubject = null

    if (hasVariation) {
      // If there's variation, show best (lowest grade) and worst (highest grade)
      bestSubject = subjectsWithNames.reduce((best, current) => 
        (current.grade < best.grade ? current : best))
      worstSubject = subjectsWithNames.reduce((worst, current) => 
        (current.grade > worst.grade ? current : worst))
    } else {
      // If grades are similar, find the course with highest grade
      // If multiple courses have same highest grade, pick the one with highest units
      // If still tied, pick the earliest one
      bestSubject = subjectsWithNames.reduce((best, current) => {
        if (current.grade < best.grade) {
          return current
        } else if (current.grade === best.grade) {
          if (current.units > best.units) {
            return current
          } else if (current.units === best.units) {
            // If same grade and units, return the earlier one (keep current best)
            return best
          }
        }
        return best
      })
    }

    return {
      best: bestSubject,
      worst: worstSubject, // This will be null when grades are similar
      hasVariation,
    }
  }

  const standing = getAcademicStanding(gwa)
  const IconComponent = standing.icon
  const insights = getPerformanceInsights()

  return (
    <div className="shadow-2xl border-0 overflow-hidden mb-6 md:mb-8 rounded-xl bg-white">
      {/* Custom Header - Dynamic Color Based on Standing */}
      <div className={`bg-gradient-to-r ${standing.headerGradient} text-white px-4 md:px-6 py-6 rounded-t-xl`}>
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
          <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
          Your GWA Result
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="text-center">
          {/* Dynamic Circle Color Based on Standing */}
          <div
            className={`inline-flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${standing.circleGradient} mb-4 md:mb-6`}
          >
            <div className={`text-3xl md:text-5xl font-bold ${standing.textColor}`}>{gwa.toFixed(4)}</div>
          </div>

          <div className="mb-4 md:mb-6">
            <Badge
              className={`${standing.color} px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-semibold rounded-full shadow-lg transition-colors`}
            >
              <IconComponent className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              {standing.status}
            </Badge>
          </div>

          {/* Dynamic Stats Cards Color Based on Standing */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto mb-6 md:mb-8">
            <div className={`text-center p-3 md:p-4 ${standing.statsBackground} rounded-lg`}>
              <div className={`text-xl md:text-2xl font-bold truncate ${standing.statsTextColor}`}>{totalUnits.toFixed(2)}</div>
              <div className="text-xs md:text-sm text-gray-600">Total Units</div>
            </div>
            <div className={`text-center p-3 md:p-4 ${standing.statsBackground} rounded-lg`}>
              <div className={`text-xl md:text-2xl font-bold truncate ${standing.statsTextColor}`}>{validSubjects.length}</div>
              <div className="text-xs md:text-sm text-gray-600">
                {validSubjects.length === 1 ? "Academic Course" : "Academic Courses"}
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          {insights && (
            <div className="border-t border-gray-200 pt-6 md:pt-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-700" />
                Performance Insights
              </h3>

              {(insights.best || insights.worst) && (
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-left mb-6 md:mb-8">
                  {/* Best Performance */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        {insights.hasVariation ? "Best Performance" : "Highest Impact"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">
                        {insights.best.name || `Subject ${validSubjects.indexOf(insights.best) + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-700">{insights.best.grade.toFixed(2)}</span>
                      <span className="text-xs text-gray-500">{insights.best.units} units</span>
                    </div>
                  </div>

                  {/* Needs Attention */}
                  {insights.worst && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 w-full max-w-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium text-orange-800">Needs Attention</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">
                          {insights.worst.name || `Subject ${validSubjects.indexOf(insights.worst) + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-700">{insights.worst.grade.toFixed(2)}</span>
                        <span className="text-xs text-gray-500">{insights.worst.units} units</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}