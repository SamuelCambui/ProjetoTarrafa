"use client"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface ProgressBarProps {
  value: number
  label: string
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 500)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="w-full mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-primary">{label}</span>
        <span className="text-sm font-medium text-primary">{progress.toFixed(2)}%</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  )
}

