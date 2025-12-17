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
      ["INC", "DRP"].includes(gradeStr)
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
    const numValue = Number.parseFloat(value) || 0
    onUpdateSubject(id, "units", numValue)
  }

  return (
    <div className="shadow-2xl border-0 overflow-hidden mb-8 rounded-xl bg-white">
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-6 py-6 rounded-t-xl">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
          Course Information
        </h2>
        <p className="text-red-100 text-sm">
          Enter your academic courses, units, and grades. Course codes are optional but recommended for performance insights.
        </p>
        <div className="mt-3 flex items-center gap-2 text-red-100 text-sm">
          <Info className="w-4 h-4" />
          <span className="">HK, PE, NSTP, and MS courses are excluded from GWA calculation.</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-700 items-center">
                <div className="col-span-5 flex justify-center gap-2">
                  <span>Course Code</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  Units
                </div>
                <div className="col-span-3 flex justify-center">
                  Grade
                </div>
                <div className="col-span-2 flex justify-center">
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
                    <div className="col-span-5 relative">
                      <Input
                        value={subject.name}
                        onChange={(e) => onUpdateSubject(subject.id, "name", e.target.value)}
                        className={`border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm text-left ${
                          isExcluded ? "bg-gray-50 text-gray-600" : ""
                        }`}
                        placeholder={`Course ${index + 1}`}
                      />
                      {isExcluded && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                          Excluded
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="1"
                        value={subject.units || ""}
                        onChange={(e) => handleUnitsChange(subject.id, e.target.value)}
                        className={`border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm text-left ${
                          isExcluded ? "bg-gray-50 text-gray-600" : ""
                        }`}
                        placeholder="3.0"
                      />
                    </div>
                    <div className="col-span-3">
                      <Select
                        value={formatGrade(subject.grade)}
                        onValueChange={(value) => handleGradeChange(subject.id, value)}
                      >
                        <SelectTrigger
                          className={`border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm text-left ${
                            isExcluded ? "bg-gray-50 text-gray-600" : ""
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
                    <div className="col-span-2 flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveSubject(subject.id)}
                        disabled={subjects.length === 1}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
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
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                      <Input
                        value={subject.name}
                        onChange={(e) => onUpdateSubject(subject.id, "name", e.target.value)}
                        className={`border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm text-left ${
                          isExcluded ? "bg-gray-50 text-gray-600" : ""
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
                          max="20"
                          step="1"
                          value={subject.units}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            const parsedValue = rawValue === "" ? "" : parseFloat(rawValue);
                            handleUnitsChange(subject.id, parsedValue.toString());
                          }}
                          onBlur={(e) => {
                            // If the user left the input empty, reset to 3
                            if (e.target.value === "") {
                              handleUnitsChange(subject.id, "3");
                            }
                          }}
                          className={`border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm text-left ${
                            isExcluded ? "bg-gray-50 text-gray-600" : ""
                          }`}
                          placeholder="3.0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                        <Select
                          value={formatGrade(subject.grade)}
                          onValueChange={(value) => handleGradeChange(subject.id, value)}
                        >
                          <SelectTrigger
                            className={`border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm text-left ${
                              isExcluded ? "bg-gray-50 text-gray-600" : ""
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
        <div className="p-4 md:p-6 bg-gradient-to-r from-gray-50 to-red-50 rounded-b-xl border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-center">
            <Button
              onClick={onAddSubject}
              variant="outline"
              size="lg"
              className="group border-2 border-red-700 text-red-700 hover:bg-red-800 hover:border-red-800 hover:text-white w-full sm:w-auto transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-base"
            >
              <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
              Add Course
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Ready to calculate?</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>

            <Button
              onClick={onCalculateGWA}
              size="lg"
              className="group bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:via-red-900 hover:to-red-950 text-white shadow-lg hover:shadow-xl px-6 md:px-8 py-3 text-base font-semibold w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
            >
              Calculate GWA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
