"use client"

import { useState } from "react"

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
      className={`pt-4 mt-4 text-center rounded-md px-4 py-5 ${standingColors.statsBackground} border-gray-200`}
    >
      <h4 className={`text-md md:text-lg font-semibold mb-2 ${standingColors.textColor}`}>
        Underload Notice
      </h4>
      <p className={`text-sm mb-4 ${standingColors.textColor}`}>
        You are currently enrolled in less than 15 credited units. Unless you have an official underload permit, you are not eligible for academic honors. This also applies to previous semesters (AY 2022-2023 onwards).
      </p>

      <button
        onClick={togglePermit}
        className={`font-bold underline text-sm cursor-pointer ${hasPermit ? "text-green-600" : standingColors.textColor}`}
        type="button"
        aria-pressed={hasPermit}
      >
        I have an underload permit
      </button>
    </div>
  )
}
