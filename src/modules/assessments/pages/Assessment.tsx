import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllSkills } from "../../shared/services/adaptiveService"
import { Skill } from "../../shared/types/adaptive"

interface GroupedSkills {
  [subject: string]: Skill[]
}

const AssessmentPage = () => {

  const [skills, setSkills] = useState<Skill[]>([])
  const [grouped, setGrouped] = useState<GroupedSkills>({})
  const navigate = useNavigate()

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    const data = await getAllSkills()
    setSkills(data)
    groupSkills(data)
  }

  // 🔥 TEMP grouping logic (you can later move to backend)
  const groupSkills = (skills: Skill[]) => {

    const map: GroupedSkills = {}

    skills.forEach(skill => {

      // simple rule (customize later)
      let subject = "General"

      if(skill.name.toLowerCase().includes("computer")){
        subject = "Computer"
      }

      if(skill.name.toLowerCase().includes("multiplication")){
        subject = "Mathematics"
      }

      if(!map[subject]) map[subject] = []

      map[subject].push(skill)

    })

    setGrouped(map)
  }

  const startQuiz = (skill: Skill) => {
    navigate(`/assessment/${skill.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}

      <h1 className="text-3xl font-bold mb-8">
        Class 9 Assessments
      </h1>


      {/* SUBJECT SECTIONS */}

      <div className="space-y-10">

        {Object.entries(grouped).map(([subject, skills]) => (

          <div key={subject}>

            {/* SUBJECT TITLE */}

            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {subject}
            </h2>


            {/* SKILLS GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {skills.map(skill => (

                <div
                  key={skill.id}
                  className="bg-white border rounded-xl p-6 hover:shadow-xl transition group"
                >

                  {/* ICON / BADGE */}

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-sm text-gray-500">
                      Skill
                    </span>

                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      Adaptive
                    </span>

                  </div>


                  {/* TITLE */}

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">

                    {skill.name}

                  </h3>


                  {/* DESCRIPTION */}

                  <p className="text-gray-600 text-sm mb-4">

                    {skill.description}

                  </p>


                  {/* FOOTER */}

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