import React from "react"

interface Props {
  progress: number
}

const ProgressBar: React.FC<Props> = ({ progress }) => {

  return (

    <div className="w-full bg-gray-200 rounded-full h-3">

      <div
        className="bg-green-500 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />

    </div>

  )

}

export default ProgressBar