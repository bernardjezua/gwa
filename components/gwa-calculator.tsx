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
  grade: number | string 
}

export default function GwaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "", units: 3, grade: 1.0 },
    { id: 2, name: "", units: 3, grade: 1.0 },
    { id: 3, name: "", units: 3, grade: 1.0 },
  ])
  const [gwa, setGwa] = useState<number | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [additionalStats, setAdditionalStats] = useState<{
    numberOfSubjects: number
    totalUnits: number
    excludedCourses: number
    averageGrade: number
  } | null>(null)

  const isExcludedFromGWA = (subject: Subject): boolean => {
    const name = subject.name.toUpperCase()
    const grade = subject.grade.toString().toUpperCase()
  
    return (
      name.includes("HK") || 
      name.includes("PE") || 
      name.includes("NSTP") || 
      grade === "INC" || 
      grade === "DRP"
    )
  }

  const addSubject = () => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1
    setSubjects([...subjects, { id: newId, name: "", units: 3, grade: 1.0 }])
    setHasCalculated(false)
  }

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id))
      setHasCalculated(false)
    }
  }

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    setHasCalculated(false)
  }

  const validateInputs = () => {
    const academicSubjects = subjects.filter((s) => !isExcludedFromGWA(s))

    const numericSubjects = academicSubjects.filter((s) => {
      const g = s.grade.toString().toUpperCase()
      const val = parseFloat(g)
      return !isNaN(val) && val >= 1.0 && val <= 5.0 && g !== "S" && g !== "U"
    })

    if (numericSubjects.length === 0) {
      toast({
        title: "Numeric Grade Required",
        description: "Please enter at least one academic course with a numeric grade (1.0 - 5.0).",
        variant: "fail",
      })
      return false
    }

    for (const s of academicSubjects) {
      if (s.units <= 0 || s.units > 20) {
        toast({
          title: "Invalid Units",
          description: `Check units for ${s.name || "Subject " + s.id}.`,
          variant: "fail",
        })
        return false
      }
    }

    return true
  }

  const calculateGWA = () => {
    if (!validateInputs()) return

    const activeSubjects = subjects.filter((s) => !isExcludedFromGWA(s))
    const totalWeightedGrades = activeSubjects.reduce((sum, s) => {
      const g = s.grade.toString().toUpperCase()
      const numericVal = parseFloat(g)
      if (!isNaN(numericVal) && g !== "S" && g !== "U") {
        return sum + numericVal * s.units
      }
      return sum
    }, 0)

    const totalAcademicUnits = activeSubjects.reduce((sum, s) => sum + s.units, 0)
    const calculatedGwa = totalWeightedGrades / totalAcademicUnits
    
    setGwa(calculatedGwa)
    setHasCalculated(true)

    setAdditionalStats({
      numberOfSubjects: activeSubjects.length,
      totalUnits: totalAcademicUnits,
      excludedCourses: subjects.filter((s) => isExcludedFromGWA(s)).length,
      averageGrade: calculatedGwa,
    })

    toast({
      title: "GWA Calculated Successfully!",
      description: `You may check your results below.`,
      variant: "success",
    })
  }

  const validSubjects = subjects.filter((s) => !isExcludedFromGWA(s))

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

        {gwa !== null && hasCalculated && additionalStats && (
          <ResultsCard
            gwa={gwa}
            totalUnits={additionalStats.totalUnits}
            validSubjects={validSubjects}
          />
        )}

        <InfoCards />
        <Footer />
      </div>
    </div>
  )
}