import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import ScoreCard from "@/modules/assessments/components/ScoreCard"
import TimerCard from "@/modules/assessments/components/TimerCard"
import QuestionCard from "@/modules/assessments/components/QuestionCard"
import ProgressBar from "@/modules/assessments/components/ProgressBar"

import { getNextQuestion, submitAnswer } from "@/modules/shared/services/adaptiveService"

import { Question, Option } from "@/modules/shared/types/adaptive"

const Assessment: React.FC = () => {

  const { chapterId } = useParams<{ chapterId: string }>()

  const studentId =
    Number(sessionStorage.getItem("studentId")) || 2

  const [question, setQuestion] = useState<Question | null>(null)

  const [selectedOption, setSelectedOption] =
    useState<number | null>(null)

  const [correctOption, setCorrectOption] =
    useState<number | null>(null)

  const [locked, setLocked] = useState(false)

  const [score, setScore] = useState(0)

  const [progress, setProgress] = useState(0)

  const [startTime, setStartTime] =
    useState<number>(Date.now())

  const loadQuestion = async () => {

    const res = await getNextQuestion(
      studentId,
      Number(chapterId)
    )

    setQuestion(res)

    setSelectedOption(null)

    setCorrectOption(null)

    setLocked(false)

    setProgress(prev => prev + 5)

    setStartTime(Date.now())

  }

  useEffect(() => {

    if (chapterId) {
      loadQuestion()
    }

  }, [chapterId])

  const handleSelect = (option: Option) => {

    if (locked) return

    setSelectedOption(option.id)

  }

  const handleSubmit = async () => {

    if (!selectedOption || !question) return

    setLocked(true)

    const timeTaken =
      Math.floor((Date.now() - startTime) / 1000)

    const res = await submitAnswer({

      studentId,
      questionId: question.id,
      selectedOptionId: selectedOption,
      timeTaken

    })

    if (res.correct) {

      setScore(prev => prev + 10)

      setCorrectOption(selectedOption)

    } else {

      setCorrectOption(null)

    }

    setTimeout(() => {

      loadQuestion()

    }, 1500)

  }

  if (!question) {

    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading assessment...
      </div>
    )

  }

  return (

    <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">

      <div className="flex justify-between">

        <TimerCard seconds={30} />

        <ScoreCard score={score} />

      </div>

      <ProgressBar progress={progress} />

      <QuestionCard
        question={question.prompt}
        options={question.options}
        selectedOption={selectedOption}
        correctOption={correctOption}
        onSelect={handleSelect}
        locked={locked}
      />

      <div className="flex justify-center">

        <button
          disabled={!selectedOption || locked}
          onClick={handleSubmit}
          className={`px-6 py-3 rounded-lg text-white font-medium
          ${selectedOption
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-300 cursor-not-allowed"}`}
        >
          Submit Answer
        </button>

      </div>

    </div>

  )

}

export default Assessment