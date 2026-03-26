import React,{useEffect,useState} from "react"
import QuizLayout from "../components/QuizLayout"
import QuestionCard from "../components/QuestionCard"
import {getNextQuestion,submitAnswer} from "../../shared/services/adaptiveService"



const studentId = 2
const chapterId = 105
const skillId = 1
const totalQuestions = 10

const AssessmentQuiz = () => {

  const [question,setQuestion] = useState<any>(null)
  const [selectedOption,setSelectedOption] = useState<number | null>(null)

  const [score,setScore] = useState(0)
  const [current,setCurrent] = useState(1)

  const [startTime,setStartTime] = useState(Date.now())
  const [time,setTime] = useState(0)

  const [feedback,setFeedback] = useState<"correct"|"incorrect"|null>(null)
  const [showFeedback,setShowFeedback] = useState(false)

  useEffect(()=>{
    loadQuestion()
  },[])

  useEffect(()=>{

    const timer = setInterval(()=>{
      setTime(Math.floor((Date.now() - startTime)/1000))
    },1000)

    return ()=>clearInterval(timer)

  },[startTime])

  const loadQuestion = async()=>{

    const q = await getNextQuestion(studentId,chapterId,skillId)

    setQuestion(q)
    setSelectedOption(null)
    setStartTime(Date.now())
    setTime(0)

  }

  const selectOption = (id:number)=>{
    setSelectedOption(id)
  }

  const submit = async()=>{

    if(!selectedOption) return

    const timeTaken = Math.floor((Date.now() - startTime)/1000)

    const res = await submitAnswer({
      studentId,
      questionId:question.id,
      selectedOptionId:selectedOption,
      timeTaken
    })

    if(res.correct){
      setFeedback("correct")
      setScore(prev => prev + 10)
    }else{
      setFeedback("incorrect")
    }

    setShowFeedback(true)

    setTimeout(()=>{

      setShowFeedback(false)
      setCurrent(prev => prev + 1)

      loadQuestion()

    },1500)

  }

  if(!question) return <div className="p-10">Loading...</div>

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      {/* Header */}

      <div className="w-full max-w-3xl flex justify-between mb-4">

        <div className="bg-white shadow rounded-xl px-6 py-3">

          <div className="text-sm text-gray-500">
            Time
          </div>

          <div className="text-lg font-semibold">
            {time}s
          </div>

        </div>

        <div className="bg-white shadow rounded-xl px-6 py-3">

          <div className="text-sm text-gray-500">
            Smart Score
          </div>

          <div className="text-lg font-semibold text-yellow-500">
            ⭐ {score}
          </div>

        </div>

      </div>


      {/* Progress Bar */}

      <div className="w-full max-w-3xl mb-6">

        <div className="h-3 bg-gray-300 rounded-full">

          <div
            className="h-3 bg-green-500 rounded-full transition-all"
            style={{width:`${(current/totalQuestions)*100}%`}}
          />

        </div>

      </div>


      {/* Question Card */}

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">

        <h2 className="text-xl font-semibold mb-6">

          {question.prompt}

        </h2>

        <div className="space-y-4">

          {question.options.map((opt:any)=>(

            <button
              key={opt.id}
              onClick={()=>selectOption(opt.id)}
              className={`w-full text-left p-4 rounded-lg border transition
              ${
                selectedOption === opt.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
              }`}
            >

              {opt.option_text}

            </button>

          ))}

        </div>

      </div>


      {/* Submit Button */}

      <button
        disabled={!selectedOption}
        onClick={submit}
        className="mt-8 px-10 py-3 rounded-lg bg-gray-300
        disabled:opacity-50
        hover:bg-blue-600 hover:text-white transition"
      >

        Submit Answer

      </button>


      {/* Feedback Animation */}

      {showFeedback && (

        <div className={`fixed bottom-0 left-0 right-0 p-6 text-center text-white text-xl font-bold
        ${feedback === "correct" ? "bg-green-500" : "bg-red-500"}
        animate-slideUp`}>

          {feedback === "correct"
            ? "🎉 Correct!"
            : "❌ Incorrect"}

        </div>

      )}

    </div>

  )

}

export default AssessmentQuiz