import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Star, Trophy, Medal, TrendingUp } from "lucide-react"
import UnderloadNotice from "./underload-notice"
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
        color: "bg-amber-500 text-white hover:bg-amber-600",
        icon: Trophy,
        headerGradient: "from-amber-600 to-amber-500",
        circleGradient: "from-amber-50 to-amber-100",
        textColor: "text-amber-900",
        statsBackground: "bg-amber-50/80",
        statsTextColor: "text-amber-900",
      }
    if (gwa > 1.45 && gwa <= 1.75)
      return {
        status: "College Scholar",
        color: "bg-amber-400 text-white hover:bg-amber-500",
        icon: Medal,
        headerGradient: "from-amber-500 to-amber-400",
        circleGradient: "from-amber-50 to-orange-50",
        textColor: "text-amber-800",
        statsBackground: "bg-amber-50/80",
        statsTextColor: "text-amber-800",
      }
    if (gwa > 1.75 && gwa <= 2.0)
      return {
        status: "Honor Roll",
        color: "bg-up-green-600 text-white hover:bg-up-green-700",
        icon: Star,
        headerGradient: "from-up-green-700 to-up-green-500",
        circleGradient: "from-up-green-50 to-up-green-100",
        textColor: "text-up-green-900",
        statsBackground: "bg-up-green-50/80",
        statsTextColor: "text-up-green-900",
      }
    if (gwa <= 3.0)
      return {
        status: "Good Standing",
        color: "bg-blue-600 text-white hover:bg-blue-700",
        icon: Award,
        headerGradient: "from-blue-700 to-blue-500",
        circleGradient: "from-blue-50 to-blue-100",
        textColor: "text-blue-900",
        statsBackground: "bg-blue-50/80",
        statsTextColor: "text-blue-900",
      }
    return {
      status: "Needs Improvement",
      color: "bg-red-600 text-white hover:bg-red-700",
      icon: Award,
      headerGradient: "from-red-700 to-red-500",
      circleGradient: "from-red-50 to-red-100",
      textColor: "text-red-900",
      statsBackground: "bg-red-50/80",
      statsTextColor: "text-red-900",
    }
  }

  const getPerformanceInsights = () => {
    if (validSubjects.length === 0) return null
    const subjectsWithNames = validSubjects.filter((s) => s.name.trim() !== "")
    if (subjectsWithNames.length === 0) return null

    const grades = subjectsWithNames.map((s) => s.grade)
    const minGrade = Math.min(...grades)
    const maxGrade = Math.max(...grades)
    const hasVariation = maxGrade - minGrade > 0.5

    let bestSubject
    let worstSubject = null

    if (hasVariation) {
      bestSubject = subjectsWithNames.reduce((best, current) =>
        current.grade < best.grade ? current : best
      )
      worstSubject = subjectsWithNames.reduce((worst, current) =>
        current.grade > worst.grade ? current : worst
      )
    } else {
      bestSubject = subjectsWithNames.reduce((best, current) => {
        if (current.grade < best.grade) return current
        else if (current.grade === best.grade) {
          if (current.units > best.units) return current
        }
        return best
      })
    }

    return {
      best: bestSubject,
      worst: worstSubject,
      hasVariation,
    }
  }

  const [hasUnderloadPermit, setHasUnderloadPermit] = useState(false)

  const standing = getAcademicStanding(gwa)
  const IconComponent = standing.icon
  const insights = getPerformanceInsights()

  const isUnderloaded = totalUnits < 15
  const isDisqualified = isUnderloaded && !hasUnderloadPermit

  useEffect(() => {
    const duration = 2.5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 100 * (timeLeft / duration)
      // Only show confetti if GWA is decent (<= 2.0)
      if (gwa <= 2.0) {
        confetti({
          ...defaults,
          particleCount,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
          colors: ['#7b1113', '#014421', '#f59e0b', '#ffffff'] // UP Colors + Gold
        })
      }
    }, 250)

    return () => clearInterval(interval)
  }, [gwa])

  // Determine if disqualified badge should be shown instead
  const displayStatus = isDisqualified && gwa <= 3.0 ? "Good Standing" : standing.status;
  const displayColor = isDisqualified && gwa <= 3.0 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : standing.color;

  return (
    <Card className="shadow-2xl border-up-maroon-100 overflow-hidden mb-8 md:mb-12 rounded-2xl bg-white/95 backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className={`bg-gradient-to-r ${standing.headerGradient} text-white px-6 py-6 md:px-8 shadow-inner`}>
        <h2 className="text-xl md:text-2xl font-heading font-bold flex items-center justify-center gap-3 tracking-tight">
          <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          Your Final GWA
        </h2>
      </div>

      <CardContent className="p-8 md:p-10">
        <div className="text-center">
          <div className="relative inline-block mb-6 md:mb-8 group">
            <div className={`absolute inset-0 bg-gradient-to-br ${standing.circleGradient} rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className={`relative flex items-center justify-center w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br ${standing.circleGradient} shadow-[inset_0_-8px_16px_rgba(0,0,0,0.05),_0_8px_32px_rgba(0,0,0,0.1)] border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.02]`}>
              <div className={`text-5xl font-extrabold ${standing.textColor} tracking-tighter drop-shadow-sm`}>
                {gwa.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="mb-8 md:mb-10">
            <Badge className={`${displayColor} px-6 py-2.5 text-base md:text-lg font-bold rounded-full shadow-lg transition-transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm`}>
              <IconComponent className="w-5 h-5 mr-2" />
              {displayStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto mb-8">
            <div className={`text-center p-5 md:p-6 ${standing.statsBackground} rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md`}>
              <div className={`text-2xl md:text-3xl font-bold truncate ${standing.statsTextColor}`}>{totalUnits.toFixed(1)}</div>
              <div className="text-sm font-medium text-gray-600 mt-1 uppercase tracking-wider text-[11px]">Total Units</div>
            </div>
            <div className={`text-center p-5 md:p-6 ${standing.statsBackground} rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md`}>
              <div className={`text-2xl md:text-3xl font-bold truncate ${standing.statsTextColor}`}>{validSubjects.length}</div>
              <div className="text-sm font-medium text-gray-600 mt-1 uppercase tracking-wider text-[11px]">
                {validSubjects.length === 1 ? "Credited Course" : "Credited Courses"}
              </div>
            </div>
          </div>

          {isUnderloaded && !hasUnderloadPermit && (
            <UnderloadNotice
              onPermitChange={setHasUnderloadPermit}
              standingColors={{
                statsBackground: standing.statsBackground,
                textColor: standing.statsTextColor,
              }}
            />
          )}

          {insights && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
              <h3 className="text-lg md:text-xl font-heading font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-up-maroon-600" />
                Performance Insights
              </h3>

              {(insights.best || insights.worst) && (
                <div className="flex flex-col md:flex-row justify-center items-stretch gap-3 md:gap-4 text-left mb-1 w-full max-w-xl">
                  <div className="bg-up-green-50/50 border border-up-green-100 rounded-xl p-4 w-full max-w-xs shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-up-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-up-green-700 uppercase tracking-widest">
                          {insights.hasVariation ? "Best Grade" : "Most Impact"}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-800 mb-3 font-medium min-h-[2rem] line-clamp-2">
                      {insights.best.name || `Subject ${validSubjects.indexOf(insights.best) + 1}`}
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <span className="text-2xl font-extrabold text-up-green-700 leading-none">{insights.best.grade.toFixed(2)}</span>
                      <span className="text-[10px] font-medium text-up-green-600/70 bg-up-green-100/50 px-2 py-0.5 rounded-md">{insights.best.units} units</span>
                    </div>
                  </div>

                  {insights.worst && (
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 w-full max-w-xs shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest">Room to Grow</span>
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-gray-800 mb-3 font-medium min-h-[2rem] line-clamp-2">
                        {insights.worst.name || `Subject ${validSubjects.indexOf(insights.worst) + 1}`}
                      </div>
                      <div className="flex items-end justify-between mt-auto">
                        <span className="text-2xl font-extrabold text-orange-600 leading-none">{insights.worst.grade.toFixed(2)}</span>
                        <span className="text-[10px] font-medium text-orange-600/70 bg-orange-100/50 px-2 py-0.5 rounded-md">{insights.worst.units} units</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
