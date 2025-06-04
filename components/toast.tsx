"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { CheckCircle2Icon, XCircle, XIcon } from "lucide-react"

export type ToastType = {
  id: string
  title: string
  description: string
  variant: "success" | "fail"
}

// Global toast state
let toasts: ToastType[] = []
let listeners: Function[] = []

// Function to notify listeners when toasts change
const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

// Toast function
export const toast = (toastData: { title: string; description: string; variant: "success" | "fail" }) => {
  const id = Date.now().toString()
  toasts = [...toasts, { id, ...toastData }]
  notifyListeners()

  // Auto remove after 3 seconds
  setTimeout(() => {
    removeToast(id)
  }, 3000)

  return id
}

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id)
  notifyListeners()
}

// Main Toast Component
export default function Toast() {
  const [toastList, setToastList] = useState<ToastType[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Add listener
    const listener = (updatedToasts: ToastType[]) => {
      setToastList(updatedToasts)
    }

    listeners.push(listener)

    // Initial state
    setToastList([...toasts])

    // Cleanup
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toastList.map((toastData) => (
        <ToastItem key={toastData.id} toast={toastData} onClose={() => removeToast(toastData.id)} />
      ))}
    </div>,
    document.body,
  )
}

// Individual Toast Item
function ToastItem({ toast: toastData, onClose }: { toast: ToastType; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: "bg-green-600 text-white",
    fail: "bg-red-600 text-white",
  }

  const icons = {
    success: <CheckCircle2Icon className="w-5 h-5" />,
    fail: <XCircle className="w-5 h-5" />,
  }

  return (
    <div
      className={`px-4 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        ${styles[toastData.variant]}`}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <span>{icons[toastData.variant]}</span>
            <p className="text-sm font-medium">{toastData.title}</p>
          </div>
          <p className="text-sm">{toastData.description}</p>
        </div>
      </div>

      <div className="ml-5 shrink-0">
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-4 mt-1 text-xl"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
