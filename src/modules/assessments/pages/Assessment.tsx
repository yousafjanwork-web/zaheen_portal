import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getAllSkills } from "../../shared/services/adaptiveService"
import { Skill } from "../../shared/types/adaptive"

interface GroupedSkills {
  [subject: string]: Skill[]
}

const AssessmentPage = () => {

  const [skills, setSkills] = useState<Skill[]>([])
  const [grouped, setGrouped] = useState<GroupedSkills>({})
  const navigate = useNavigate()
  const location = useLocation()

  // ✅ get type from query param
  const query = new URLSearchParams(location.search)
  const type = query.get("type")

  useEffect(() => {
    if (type === "9-12") {
      loadSkills()
    }
  }, [type])

  const loadSkills = async () => {
    const data = await getAllSkills()
    setSkills(data)
    groupSkills(data)
  }

  const groupSkills = (skills: Skill[]) => {
    const map: GroupedSkills = {}

    skills.forEach(skill => {

      let subject = "General"

      if (skill.name.toLowerCase().includes("computer")) {
        subject = "Computer"
      }

      if (skill.name.toLowerCase().includes("multiplication")) {
        subject = "Mathematics"
      }

      if (!map[subject]) map[subject] = []

      map[subject].push(skill)
    })

    setGrouped(map)
  }

  const startQuiz = (skill: Skill) => {
    navigate(`/assessment/${skill.id}`)
  }

  // =========================
  // 🚫 Coming Soon UI
  // =========================
  if (type !== "9-12") {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">
          🚧 Assessments Coming Soon
        </h1>
        <p className="text-gray-600 mb-6">
          We are preparing interactive assessments for this grade.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go Back
        </button>
      </div>
    )
  }

  // =========================
  // ✅ Main Assessment UI
  // =========================

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Class 9 Assessments
      </h1>

      <div className="space-y-10">

        {Object.entries(grouped).map(([subject, skills]) => (

          <div key={subject}>

            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {subject}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {skills.map(skill => (

                <div
                  key={skill.id}
                  className="bg-white border rounded-xl p-6 hover:shadow-xl transition group"
                >

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      Skill
                    </span>

                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Adaptive
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">
                    {skill.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {skill.description}
                  </p>

                  <div className="flex justify-between items-center">

                    <span className="text-xs text-gray-400">
                      10 Questions
                    </span>

                    <button
                      onClick={() => startQuiz(skill)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Start
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default AssessmentPage