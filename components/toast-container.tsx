"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import ToastNotification from "./toast-notification"

export type ToastType = {
  id: string
  message: string
  title: string
  type: "success" | "fail"
}

// Global toast state
let toasts: ToastType[] = []
let listeners: Function[] = []

// Function to notify listeners when toasts change
const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

// Toast functions
export const toast = {
  success: (title: string, message: string) => {
    const id = Date.now().toString()
    toasts = [...toasts, { id, title, message, type: "success" }]
    notifyListeners()

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.remove(id)
    }, 3000)

    return id
  },

  fail: (title: string, message: string) => {
    const id = Date.now().toString()
    toasts = [...toasts, { id, title, message, type: "fail" }]
    notifyListeners()

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.remove(id)
    }, 3000)

    return id
  },

  remove: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id)
    notifyListeners()
  },
}

export default function ToastContainer() {
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
      {toastList.map((toast) => (
        <ToastNotification
          key={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => toast.remove(toast.id)}
        />
      ))}
    </div>,
    document.body,
  )
}
