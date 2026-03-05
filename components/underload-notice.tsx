"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"

interface UnderloadNoticeProps {
  onPermitChange: (hasPermit: boolean) => void
  standingColors: {
    statsBackground: string
    textColor: string
  }
}

export default function UnderloadNotice({
  onPermitChange,
  standingColors,
}: UnderloadNoticeProps) {
  const [hasPermit, setHasPermit] = useState<boolean>(false)

  const togglePermit = () => {
    setHasPermit((prev) => {
      onPermitChange(!prev)
      return !prev
    })
  }

  return (
    <div
      className={`mt-6 max-w-xl mx-auto text-center rounded-xl px-5 py-5 ${standingColors.statsBackground} border border-white/40 shadow-sm relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-orange-400 opacity-60"></div>
      
      <div className="flex flex-col items-center gap-2.5">
        <AlertCircle className={`w-6 h-6 ${standingColors.textColor} opacity-80`} />
        <div>
          <h4 className={`text-base font-bold mb-1.5 ${standingColors.textColor}`}>
            Underload Notice
          </h4>
          <p className={`text-sm mb-4 max-w-lg mx-auto ${standingColors.textColor} opacity-90 leading-relaxed`}>
            You are currently enrolled in less than 15 credited units. Unless you have an official underload permit, you are not eligible for academic honors.
          </p>

          <button
            onClick={togglePermit}
            className={`font-semibold text-sm mx-auto transition-all focus:outline-none flex items-center justify-center gap-2 ${hasPermit ? "text-up-green-700" : standingColors.textColor + " hover:opacity-75"} underline decoration-2 underline-offset-4`}
            type="button"
            aria-pressed={hasPermit}
          >
            I have an official underload permit
          </button>
        </div>
      </div>
    </div>
  )
}
