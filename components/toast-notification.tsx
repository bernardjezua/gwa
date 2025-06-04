"use client"

import { useEffect, useState } from "react"
import { CheckCircle2Icon, XCircle, XIcon } from "lucide-react"

interface ToastNotificationProps {
  title: string
  message: string
  type: "success" | "fail"
  onClose: () => void
}

export default function ToastNotification({ title, message, type, onClose }: ToastNotificationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger fade-in
    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false) // Start fade-out
      setTimeout(onClose, 300) // Remove after transition
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
      className={`px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] transition-all duration-300 ease-in-out 
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"} 
        ${styles[type]}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span>{icons[type]}</span>
          <p className="font-medium">{title}</p>
        </div>
        {message && <p className="text-sm mt-1">{message}</p>}
      </div>
      <button onClick={() => setVisible(false)} className="ml-4 text-xl">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
