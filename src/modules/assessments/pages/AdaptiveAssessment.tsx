import React, { useEffect, useState } from "react"

import ScoreCard from "../components/ScoreCard"
import TimerCard from "../components/TimerCard"
import QuestionCard from "../components/QuestionCard"
import ProgressBar from "../components/ProgressBar"

import { getNextQuestion } from "../../shared/services/adaptiveService"
import { AdaptiveResponse, QuestionOption } from "../../shared/types/adaptive"

const AdaptiveAssessment: React.FC = () => {

  const studentId = Number(sessionStorage.getItem("studentId"))
  const chapterId = 105

  const [data, setData] = useState<AdaptiveResponse | null>(null)
  const [score, setScore] = useState(0)

  const loadQuestion = async () => {

    const res = await getNextQuestion(studentId, chapterId)

    setData(res)
    setScore(res.smartScore)

  }

  useEffect(() => {
    loadQuestion()
  }, [])

  const handleAnswer = (option: QuestionOption) => {

    if (option.is_correct === 1) {
      setScore(prev => prev + 10)
    }

    loadQuestion()

  }

  if (!data) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    )
  }

  return (

    <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <TimerCard seconds={30} />

        <ScoreCard score={score} />

      </div>

      {/* Progress */}

      <ProgressBar progress={data.progress} />

      {/* Question */}

      <QuestionCard
        question={data.question.prompt}
        options={data.question.options}
        onSelect={handleAnswer}
      />

    </div>

  )
}

export default AdaptiveAssessment