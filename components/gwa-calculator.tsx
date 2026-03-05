"use client"

import { useState } from "react"
import Header from "./header"
import SubjectTable from "./subject-table"
import ResultsCard from "./results-card"
import InfoCards from "./info-cards"
import Footer from "./footer"
import { toast } from "./toast"

export interface Subject {
  id: number
  name: string
  units: number | string
  grade: number
}

export default function GwaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "", units: 3, grade: 1.0 },
    { id: 2, name: "", units: 3, grade: 1.0 },
    { id: 3, name: "", units: 3, grade: 1.0 },
  ])
  const [gwa, setGwa] = useState<number | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [invalidSubjects, setInvalidSubjects] = useState<number[]>([]) // Array of Subject IDs
  const [additionalStats, setAdditionalStats] = useState<{
    numberOfSubjects: number
    totalUnits: number
    excludedCourses: number
    averageGrade: number
  } | null>(null)

  const isExcludedFromGWA = (subjectName: string): boolean => {
    const name = subjectName.toUpperCase()
    return name.includes("HK") || name.includes("PE") || name.includes("NSTP")
  }

  const addSubject = () => {
    const newId = Math.max(...subjects.map((s) => s.id)) + 1
    setSubjects([...subjects, { id: newId, name: "", units: 3, grade: 1.0 }])
    setHasCalculated(false) // Reset results visibility on adding a subject
  }

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id))
      setHasCalculated(false) // Optional: also reset when removing a subject
    }
  }

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    setHasCalculated(false)
    setInvalidSubjects(invalidSubjects.filter(invalidId => invalidId !== id)) // Clear error state on edit
  }

  const validateInputs = () => {
    // Check if there are no valid subjects at all (all empty or excluded)
    const validSubjects = subjects.filter((s) => {
      const u = Number(s.units)
      const hasValidUnits = !isNaN(u) && s.units !== "" && u >= 0.25 && u <= 10
      const hasValidGrade = s.grade > 0
      const isExcluded = isExcludedFromGWA(s.name)
      return hasValidUnits && hasValidGrade && !isExcluded
    })

    if (validSubjects.length === 0) {
      toast({
        title: "Incomplete Information",
        description: "Please enter missing fields or at least one course with a numerical grade.",
        variant: "fail",
      })
      return false
    }

    const invalidGrades = validSubjects.filter((s) => s.grade < 1.0 || s.grade > 5.0)
    if (invalidGrades.length > 0) {
      toast({
        title: "Invalid Grade Range",
        description: "Grades must be between 1.0 and 5.0.",
        variant: "fail",
      })
      return false
    }

    // Check for invalid, zero, missing, or > 10 units
    const invalidUnits = subjects.filter((s) => {
      const u = Number(s.units)
      return (s.units === "" || isNaN(u) || u < 0.25 || u > 10) && !isExcludedFromGWA(s.name)
    })
    
    if (invalidUnits.length > 0) {
      setInvalidSubjects(invalidUnits.map(s => s.id))
      toast({
        title: "Invalid Units",
        description: "Units must be between 0.25 and 10.",
        variant: "fail",
      })
      return false
    }

    setInvalidSubjects([])
    return true
  }

  const calculateGWA = () => {
    if (!validateInputs()) {
      return
    }

    const validSubjects = subjects.filter(
      (s) => Number(s.units) > 0 && s.grade > 0 && !isExcludedFromGWA(s.name)
    )

    const totalWeightedGrades = validSubjects.reduce(
      (sum, subject) => sum + subject.grade * Number(subject.units),
      0
    )
    const totalUnits = validSubjects.reduce((sum, subject) => sum + Number(subject.units), 0)

    const calculatedGwa = totalWeightedGrades / totalUnits
    setGwa(calculatedGwa)
    setHasCalculated(true)

    const excludedCount = subjects.filter((s) => isExcludedFromGWA(s.name)).length

    setAdditionalStats({
      numberOfSubjects: validSubjects.length,
      totalUnits,
      excludedCourses: excludedCount,
      averageGrade: calculatedGwa,
    })

    toast({
      title: "GWA Calculated Successfully!",
      description: `You may check your results below.`,
      variant: "success",
    })
  }

  const validSubjects = subjects.filter(
    (s) => Number(s.units) > 0 && s.grade > 0 && !isExcludedFromGWA(s.name)
  )

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50/50 m-0 p-0 overflow-x-hidden font-sans">
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <SubjectTable
          subjects={subjects}
          invalidSubjects={invalidSubjects}
          onAddSubject={addSubject}
          onRemoveSubject={removeSubject}
          onUpdateSubject={updateSubject}
          onCalculateGWA={calculateGWA}
        />

        {gwa !== null && hasCalculated && additionalStats && (
          <ResultsCard
            gwa={gwa}
            totalUnits={additionalStats.totalUnits}
            validSubjects={validSubjects}
          />
        )}

        <InfoCards />
      </main>

      <Footer />
    </div>
  )
}
