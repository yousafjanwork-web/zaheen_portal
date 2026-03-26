import React from "react"
import ProgressBar from "./ProgressBar"
import LivesIndicator from "./LivesIndicator"

interface Props {
  progress:number
  questionNumber:number
  total:number
  score:number
  lives:number
  children:any
}

const QuizLayout = ({
  progress,
  questionNumber,
  total,
  score,
  lives,
  children
}:Props) => {

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="max-w-2xl mx-auto w-full p-6">

        <ProgressBar progress={progress}/>

        <div className="flex justify-between mt-4 text-sm">

          <span>
            Question {questionNumber} / {total}
          </span>

          <span className="font-semibold">
            Score {score}
          </span>

        </div>

      </div>

      <div className="flex-grow flex items-center justify-center">

        {children}

      </div>

      <div className="p-6">

        <LivesIndicator lives={lives}/>

      </div>

    </div>
  )
}

export default QuizLayout