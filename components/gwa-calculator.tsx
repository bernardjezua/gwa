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
  units: number
  grade: number
}

export default function GwaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "", units: 3, grade: 0 },
    { id: 2, name: "", units: 3, grade: 0 },
    { id: 3, name: "", units: 3, grade: 0 },
  ])
  const [gwa, setGwa] = useState<number | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  // Check if subject is excluded from GWA calculation
  const isExcludedFromGWA = (subjectName: string): boolean => {
    const name = subjectName.toUpperCase()
    return name.includes("HK") || name.includes("PE") || name.includes("NSTP")
  }

  const addSubject = () => {
    const newId = Math.max(...subjects.map((s) => s.id)) + 1
    setSubjects([...subjects, { id: newId, name: "", units: 3, grade: 0 }])
  }

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id))
    }
  }

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    // Reset calculation state when subjects are modified
    setHasCalculated(false)
  }

  const validateInputs = () => {
    const validSubjects = subjects.filter((s) => {
      // Check if subject has valid units and grade
      const hasValidUnits = s.units > 0;
      const hasValidGrade = s.grade > 0;
      
      // Check if subject is excluded from GWA calculation
      const isExcluded = isExcludedFromGWA(s.name);
      
      return hasValidUnits && hasValidGrade && !isExcluded;
    });

    if (validSubjects.length === 0) {
      toast({
        title: "Incomplete Information",
        description: "Please enter missing fields.",
        variant: "fail",
      })
      return false
    }

    // Check for invalid grades
    const invalidGrades = validSubjects.filter((s) => s.grade < 1.0 || s.grade > 5.0)
    if (invalidGrades.length > 0) {
      toast({
        title: "Invalid Grade Range",
        description: "Grades must be between 1.0 and 5.0.",
        variant: "fail",
      })
      return false
    }

    // Check for invalid units
    const invalidUnits = validSubjects.filter((s) => s.units <= 0 || s.units > 12)
    if (invalidUnits.length > 0) {
      toast({
        title: "Invalid Units",
        description: "Units must be within the range of 1 to 12.",
        variant: "fail",
      })
      return false
    }

    return true
  }

  const calculateGWA = () => {
    if (!validateInputs()) {
      return
    }

    // Only include subjects that are not excluded from GWA calculation
    const validSubjects = subjects.filter((s) => s.units > 0 && s.grade > 0 && !isExcludedFromGWA(s.name))
    const totalWeightedGrades = validSubjects.reduce((sum, subject) => sum + subject.grade * subject.units, 0)
    const totalUnits = validSubjects.reduce((sum, subject) => sum + subject.units, 0)

    const calculatedGwa = totalWeightedGrades / totalUnits
    setGwa(Math.round(calculatedGwa * 100) / 100)
    setHasCalculated(true)

    // Determine academic standing for toast message
    let standing = "Good Standing"
    if (calculatedGwa < 1.45) standing = "University Scholar"
    else if (calculatedGwa < 1.75) standing = "College Scholar"
    else if (calculatedGwa < 2.0) standing = "Honor Roll"

    const excludedCount = subjects.filter((s) => isExcludedFromGWA(s.name)).length

    toast({
      title: "GWA Calculated Successfully!",
      description: `Your GWA is ${calculatedGwa.toFixed(2)} - ${standing}${excludedCount > 0 ? ` (${excludedCount} course/s excluded).` : "."}`,
      variant: "success",
    })
  }

  const totalUnits = subjects.reduce((sum, s) => sum + (s.units || 0), 0)
  const validSubjects = subjects.filter((s) => s.units > 0 && s.grade > 0 && !isExcludedFromGWA(s.name))
  const allValidSubjects = subjects.filter((s) => s.units > 0 && s.grade > 0) // For stats display

  return (
    <div className="flex flex-col w-full m-0 p-0 overflow-x-hidden">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8 w-full">
        <SubjectTable
          subjects={subjects}
          onAddSubject={addSubject}
          onRemoveSubject={removeSubject}
          onUpdateSubject={updateSubject}
          onCalculateGWA={calculateGWA}
        />

        {gwa !== null && hasCalculated && (
          <ResultsCard
            gwa={gwa}
            totalUnits={validSubjects.reduce((sum, s) => sum + s.units, 0)}
            validSubjects={validSubjects}
          />
        )}

        <InfoCards />
        <Footer />
      </div>
    </div>
  )
}
