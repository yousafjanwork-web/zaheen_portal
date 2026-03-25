import React from "react"

interface Props {
  score: number
}

const ScoreCard: React.FC<Props> = ({ score }) => {

  return (
    <div className="bg-white shadow-md rounded-xl px-6 py-4">

      <p className="text-xs text-gray-500">
        Smart Score
      </p>

      <p className="text-lg font-semibold text-gray-800">
        ⭐ {score}
      </p>

    </div>
  )
}

export default ScoreCard