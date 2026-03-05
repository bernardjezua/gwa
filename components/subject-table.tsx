"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Plus, Calculator, Trash2, Info } from "lucide-react"
import { toast } from "./toast"
import type { Subject } from "./gwa-calculator"

interface SubjectTableProps {
  subjects: Subject[]
  invalidSubjects: number[]
  onAddSubject: () => void
  onRemoveSubject: (id: number) => void
  onUpdateSubject: (id: number, field: keyof Subject, value: string | number) => void
  onCalculateGWA: () => void
}

const gradeOptions = [
  { value: "1.00", label: "1.00 (Excellent)" },
  { value: "1.25", label: "1.25 (Excellent)" },
  { value: "1.50", label: "1.50 (Very Good)" },
  { value: "1.75", label: "1.75 (Very Good)" },
  { value: "2.00", label: "2.00 (Good)" },
  { value: "2.25", label: "2.25 (Good)" },
  { value: "2.50", label: "2.50 (Satisfactory)" },
  { value: "2.75", label: "2.75 (Satisfactory)" },
  { value: "3.00", label: "3.00 (Pass)" },
  { value: "4.00", label: "4.00 (Conditional)" },
  { value: "5.00", label: "5.00 (Fail)" },
  { value: "S", label: "S (Satisfactory)" },
  { value: "U", label: "U (Unsatisfactory)" },
  { value: "INC", label: "INC (Incomplete)" },
  { value: "DRP", label: "DRP (Dropped)" },
]

export default function SubjectTable({
  subjects,
  invalidSubjects,
  onAddSubject,
  onRemoveSubject,
  onUpdateSubject,
  onCalculateGWA,
}: SubjectTableProps) {
  // Check if subject is excluded from GWA calculation
  const isExcludedFromGWA = (subjectName: string, grade?: string | number): boolean => {
    const name = subjectName.toUpperCase()
    const gradeStr = String(grade).toUpperCase()
    return (
      name.includes("HK") ||
      name.includes("PE") ||
      name.includes("NSTP") ||
      ["S", "U", "INC", "DRP"].includes(gradeStr)
    )
  }

  // Format grade to ensure it has 2 decimal places for display and comparison
  const formatGrade = (grade: number | string): string => {
    if (grade === null || grade === undefined || grade === "") return ""
    if (typeof grade === "number") {
      return grade.toFixed(2)
    }
    return String(grade)
  }

  const handleGradeChange = (id: number, value: string) => {
    const parsed = parseFloat(value)
    const isNumeric = !isNaN(parsed)
    onUpdateSubject(id, "grade", isNumeric ? parsed : value)
  }  

  const handleUnitsChange = (id: number, value: string) => {
    // Return early if the unit input is left clear
    if (value === "") {
      onUpdateSubject(id, "units", "") // Pass empty string natively
      return
    }

    // Replace invalid characters; keep only numbers and one decimal point
    const numericStr = value.replace(/[^0-9.]/g, "")
    
    // Check if there's more than one decimal point
    const parts = numericStr.split(".")
    if (parts.length > 2) {
      return
    }

    // Check if more than 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return
    }

    const numValue = parseFloat(numericStr)
    
    // Avoid parsing NaN
    if (isNaN(numValue)) {
      onUpdateSubject(id, "units", "") // Use empty string to safely reset bad input
      return
    }
    
    // Only allow max up to 10
    if (numValue > 10) {
      return
    }
    
    // Restrict typing decimals that would definitely result in < 0.25
    // Example: "0.0" and "0.1" are blocked
    if (parts.length === 2 && parts[1].length >= 1) {
      if (parts[0] === "0") {
        if (parts[1][0] === "0" || parts[1][0] === "1") {
          return // Block 0.0, 0.1
        }
        if (parts[1].length === 2 && parts[1][0] === "2" && ["0", "1", "2", "3", "4"].includes(parts[1][1])) {
          return // Block 0.20, 0.21, 0.22, 0.23, 0.24
        }
      }
    }
    
    // Remove leading zeros (e.g., '01' -> '1', '002' -> '2') but keep '0' or '0.'
    let finalStr = numericStr
    if (finalStr.length > 1 && finalStr.startsWith("0") && !finalStr.startsWith("0.")) {
      finalStr = finalStr.replace(/^0+/, "")
    }

    // We pass the string directly to state to allow '0', '0.', '1.0' etc. to stay accurately rendered
    onUpdateSubject(id, "units", finalStr)
  }

  return (
    <div className="shadow-xl border-up-maroon-100 overflow-hidden mb-8 rounded-2xl bg-white transition-all duration-300">
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-up-maroon-800 to-up-maroon-700 text-white px-6 py-6 md:px-8 md:py-8">
        <h2 className="text-xl md:text-2xl font-heading font-bold flex items-center gap-3 mb-2 tracking-tight">
          <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          Course Information
        </h2>
        <p className="text-up-maroon-100 text-sm md:text-base font-medium leading-relaxed max-w-3xl">
          Enter your academic courses, corresponding units, and grades to calculate your GWA. Course codes are limited to 12 characters. Units can be from 0.25 to 10.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-up-maroon-100 text-xs md:text-sm bg-up-maroon-900/30 px-3 py-1.5 rounded-md border border-up-maroon-600/30">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>SP/Thesis, HK, PE, NSTP, and MS courses are excluded from GWA calculation.</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-700 items-center">
                <div className="col-span-6 flex justify-center gap-2">
                  <span>Course Code</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  Units
                </div>
                <div className="col-span-3 flex justify-center">
                  Grade
                </div>
                <div className="col-span-1 flex justify-center text-center">
                  Action
                </div>
              </div>
            </div>

            {/* Subject Rows */}
            <div className="divide-y divide-gray-100">
              {subjects.map((subject, index) => {
                const isExcluded = isExcludedFromGWA(subject.name, subject.grade)
                return (
                  <div
                    key={subject.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${
                      isExcluded ? "" : ""
                    }`}
                  >
                    <div className="col-span-6 relative">
                      <Input
                        value={subject.name}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase().slice(0, 12);
                          onUpdateSubject(subject.id, "name", val);
                        }}
                        maxLength={12}
                        className={`border-gray-200 focus-visible:ring-1 focus-visible:ring-up-maroon-500 focus-visible:border-up-maroon-500 text-sm text-left shadow-sm ${
                          isExcluded ? "bg-gray-50/80 text-gray-500" : ""
                        }`}
                        placeholder={`Course ${index + 1}`}
                      />
                      {isExcluded && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm z-10">
                          Excluded
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.01"
                        value={subject.units}
                        onChange={(e) => handleUnitsChange(subject.id, e.target.value)}
                        className={`text-sm text-left shadow-sm ${
                          invalidSubjects.includes(subject.id) 
                            ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500 ring-1 ring-red-500" 
                            : "border-gray-200 focus-visible:ring-1 focus-visible:ring-up-maroon-500 focus-visible:border-up-maroon-500"
                        } ${
                          isExcluded ? "bg-gray-50/80 text-gray-500" : ""
                        }`}
                        placeholder=""
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={formatGrade(subject.grade)}
                        onValueChange={(value) => handleGradeChange(subject.id, value)}
                      >
                        <SelectTrigger
                          className={`border-gray-200 focus-visible:ring-1 focus-visible:ring-up-maroon-500 focus-visible:border-up-maroon-500 text-sm text-left shadow-sm ${
                            isExcluded ? "bg-gray-50/80 text-gray-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveSubject(subject.id)}
                        disabled={subjects.length === 1}
                        className="border-red-200/60 text-red-500 bg-red-50/30 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-100">
            {subjects.map((subject, index) => {
              const isExcluded = isExcludedFromGWA(subject.name)
              return (
                <div key={subject.id} className={`p-4 space-y-4 ${isExcluded ? "bg-gray-50" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">Course {index + 1}</h3>
                      {isExcluded && (
                        <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Excluded
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveSubject(subject.id)}
                      disabled={subjects.length === 1}
                      className="border-red-200/60 text-red-500 bg-red-50/30 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors shadow-sm disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                        <Input
                          value={subject.name}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase().slice(0, 12);
                            onUpdateSubject(subject.id, "name", val);
                          }}
                          maxLength={12}
                          className={`border-gray-200 focus-visible:ring-1 focus-visible:ring-up-maroon-500 focus-visible:border-up-maroon-500 text-sm text-left shadow-sm ${
                          isExcluded ? "bg-gray-50/80 text-gray-500" : ""
                        }`}
                        placeholder={`Subject ${index + 1}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={subject.units}
                          onChange={(e) => handleUnitsChange(subject.id, e.target.value)}
                          className={`text-sm text-left shadow-sm ${
                            invalidSubjects.includes(subject.id) 
                              ? "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500 ring-1 ring-red-500" 
                              : "border-gray-200 focus-visible:ring-1 focus-visible:ring-up-maroon-500 focus-visible:border-up-maroon-500"
                          } ${
                            isExcluded ? "bg-gray-50/80 text-gray-500" : ""
                          }`}
                          placeholder=""
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <Select
                          value={formatGrade(subject.grade)}
                          onValueChange={(value) => handleGradeChange(subject.id, value)}
                        >
                          <SelectTrigger
                            className={`border-gray-200 focus-visible:ring-1 focus-visible:ring-up-maroon-500 focus-visible:border-up-maroon-500 text-sm text-left shadow-sm ${
                              isExcluded ? "bg-gray-50 text-gray-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {gradeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="p-6 md:p-8 bg-gray-50/80 rounded-b-2xl border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
            <Button
              onClick={onAddSubject}
              variant="outline"
              size="lg"
              className="group border-2 border-up-maroon-700 text-up-maroon-700 hover:bg-up-maroon-50 w-full sm:w-auto transition-all duration-200 shadow-sm font-semibold text-base px-6 h-12"
            >
              <Plus className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
              Add Course
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 font-medium tracking-wide uppercase text-[11px]">
              <div className="w-8 h-px bg-gray-300"></div>
              <span>Ready to calculate</span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>

            <Button
              onClick={onCalculateGWA}
              size="lg"
              className="group bg-up-maroon-800 hover:bg-up-maroon-700 text-white shadow-md hover:shadow-lg px-8 py-3 h-12 text-base font-semibold w-full sm:w-auto transition-all duration-300"
            >
              Calculate GWA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
