import React from "react"
import { Option } from "@/modules/shared/types/adaptive"

interface Props {
  question: string
  options: Option[]
  selectedOption: number | null
  correctOption: number | null
  onSelect: (option: Option) => void
  locked: boolean
}

const QuestionCard: React.FC<Props> = ({
  question,
  options,
  selectedOption,
  correctOption,
  onSelect,
  locked
}) => {

  const getStyle = (optionId: number) => {

    if (!locked) {
      return selectedOption === optionId
        ? "border-blue-500 bg-blue-50"
        : "hover:bg-gray-50"
    }

    if (optionId === correctOption)
      return "border-green-500 bg-green-100"

    if (optionId === selectedOption)
      return "border-red-500 bg-red-100"

    return ""
  }

  return (

    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {question}
      </h2>

      <div className="grid gap-3">

        {options.map((opt) => (

          <button
            key={opt.id}
            disabled={locked}
            onClick={() => onSelect(opt)}
            className={`border rounded-lg p-3 text-left transition
            ${getStyle(opt.id)}`}
          >
            {opt.option_text}
          </button>

        ))}

      </div>

    </div>

  )

}

export default QuestionCard