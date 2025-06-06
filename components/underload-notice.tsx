"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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

  const handleChange = (checked: boolean) => {
    setHasPermit(checked)
    onPermitChange(checked)
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

      <div className="flex justify-center items-center gap-2">
        <Checkbox
          id="underload-permit"
          checked={hasPermit}
          onCheckedChange={handleChange}
        />
        <Label htmlFor="underload-permit" className={`text-sm ${standingColors.textColor}`}>
          I have an underload permit
        </Label>
      </div>
    </div>
  )
}
