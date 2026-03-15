import React, { useEffect, useState } from "react"

interface Props {
  seconds: number
}

const TimerCard: React.FC<Props> = ({ seconds }) => {

  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)

  }, [])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="bg-white shadow-md rounded-xl px-6 py-4">

      <p className="text-xs text-gray-500">
        Time
      </p>

      <p className="text-lg font-semibold text-gray-800">
        {mins}:{secs < 10 ? `0${secs}` : secs}
      </p>

    </div>
  )
}

export default TimerCard