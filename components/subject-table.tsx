"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Plus, Calculator, Trash2 } from "lucide-react"
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
  { value: "1.25", label: "1.25 (Very Good)" },
  { value: "1.50", label: "1.50 (Very Good)" },
  { value: "1.75", label: "1.75 (Good)" },
  { value: "2.00", label: "2.00 (Good)" },
  { value: "2.25", label: "2.25 (Satisfactory)" },
  { value: "2.50", label: "2.50 (Satisfactory)" },
  { value: "2.75", label: "2.75 (Fair)" },
  { value: "3.00", label: "3.00 (Pass)" },
  { value: "4.00", label: "4.00 (Conditional Pass)" },
  { value: "5.00", label: "5.00 (Fail)" },
]

export default function SubjectTable({
  subjects,
  onAddSubject,
  onRemoveSubject,
  onUpdateSubject,
  onCalculateGWA,
}: SubjectTableProps) {
  // Format grade to ensure it has 2 decimal places for display and comparison
  const formatGrade = (grade: number): string => {
    if (grade === 0) return ""
    return grade.toFixed(2)
  }

  const handleGradeChange = (id: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    onUpdateSubject(id, "grade", numValue)
  }

  const handleUnitsChange = (id: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0

    if (numValue > 10) {
      toast({
        title: "Invalid Units",
        description: "Units cannot exceed 10.0",
        variant: "fail",
      })
    }

    onUpdateSubject(id, "units", numValue)
  }

  return (
    <div className="shadow-2xl border-0 overflow-hidden mb-8 rounded-xl bg-white">
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-red-800 to-red-700 text-white px-4 md:px-6 py-6 rounded-t-xl">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
          Subject Information
        </h2>
        <p className="text-red-100 text-sm md:text-base">
          Enter your subjects, units, and grades. Select from standard UP grade values.
        </p>
      </div>

      {/* Content */}
      <div className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-700">
                <div className="col-span-5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Subject Name
                </div>
                <div className="col-span-2">Units</div>
                <div className="col-span-3">Grade</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
            </div>

            {/* Subject Rows */}
            <div className="divide-y divide-gray-100">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-red-50 transition-colors">
                  <div className="col-span-5">
                    <Input
                      value={subject.name}
                      onChange={(e) => onUpdateSubject(subject.id, "name", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder={`Subject ${index + 1}`}
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={subject.units || ""}
                      onChange={(e) => handleUnitsChange(subject.id, e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="3.0"
                    />
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={formatGrade(subject.grade)}
                      onValueChange={(value) => handleGradeChange(subject.id, value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
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
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-100">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Subject {index + 1}</h3>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <Input
                      value={subject.name}
                      onChange={(e) => onUpdateSubject(subject.id, "name", e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm"
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
                        step="0.5"
                        value={subject.units || ""}
                        onChange={(e) => handleUnitsChange(subject.id, e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm"
                        placeholder="3.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                      <Select
                        value={formatGrade(subject.grade)}
                        onValueChange={(value) => handleGradeChange(subject.id, value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm">
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
            ))}
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
              className="text-md group border-2 border-red-300 text-red-700 hover:bg-red-800 hover:border-red-800 hover:text-white w-full sm:w-auto transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-base"
            >
              <Plus className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
              Add Subject
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Ready to calculate?</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>

            <Button
              onClick={onCalculateGWA}
              size="lg"
              className="text-md group bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-800 hover:via-red-900 hover:to-red-950 text-white shadow-lg hover:shadow-xl px-6 md:px-8 py-3 text-base font-semibold w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
            >
              Calculate GWA
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
