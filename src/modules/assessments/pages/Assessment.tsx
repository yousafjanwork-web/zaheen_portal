import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllSkills } from "../../shared/services/adaptiveService"
import { Skill } from "../../shared/types/adaptive"

const AssessmentPage = () => {

  const [skills, setSkills] = useState<Skill[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    const data = await getAllSkills()
    setSkills(data)
  }

  const startQuiz = (skill: Skill) => {
    navigate(`/assessment/${skill.id}`)
  }

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Available Assessments
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {skills.map((skill) => (

          <div
            key={skill.id}
            className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition"
            onClick={() => startQuiz(skill)}
          >

            <h2 className="text-xl font-semibold mb-2">
              {skill.name}
            </h2>

            <p className="text-gray-600">
              {skill.description}
            </p>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
              Start Assessment
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AssessmentPage