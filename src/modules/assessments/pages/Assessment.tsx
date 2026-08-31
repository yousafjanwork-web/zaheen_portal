import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
<<<<<<< HEAD
import { getAllSkills } from "../../shared/services/adaptiveService"
import { Skill } from "../../shared/types/adaptive"
=======
import axios from "axios"
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

interface Skill {
  id: number
  name: string
  description: string | null
  total: number | null
  subject_id: number
}

interface Subject {
  id: number
  name: string
  urdu_name: string
  skills: Skill[]
}

const AssessmentPage = () => {

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

<<<<<<< HEAD
  // ✅ get type from query param
=======
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  const query = new URLSearchParams(location.search)
  const type = query.get("type")

  useEffect(() => {
<<<<<<< HEAD
    if (type === "9-12") {
      loadSkills()
    }
=======
    loadSubjects()
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  }, [type])

  const getClassId = () => {

    switch (type) {

      case "9":
        return 10

      case "10":
        return 11

      case "11":
        return 12

      case "12":
        return 13

      default:
        return null
    }
  }

<<<<<<< HEAD
  const groupSkills = (skills: Skill[]) => {
    const map: GroupedSkills = {}
=======
  const loadSubjects = async () => {

    try {
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

      const classId = getClassId()

<<<<<<< HEAD
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
=======
      if (!classId) {
        setLoading(false)
        return
      }

      const res = await axios.get(
        "https://api.zaheen.com.pk/api/meta/subjects-skills",
        {
          params: {
            classId
          }
        }
      )

      setSubjects(res.data)

    } catch (error) {

      console.error("Failed to load subjects", error)
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

    } finally {

      setLoading(false)
    }
  }

  const startQuiz = (skill: Skill) => {

    navigate(`/assessment/${skill.id}`)
  }

<<<<<<< HEAD
  // =========================
  // 🚫 Coming Soon UI
  // =========================
  if (type !== "9-12") {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">
          🚧 Assessments Coming Soon
        </h1>
=======
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        Loading...
      </div>
    )
  }

  if (!getClassId()) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">

        <h1 className="text-3xl font-bold mb-4">
          🚧 Assessments Coming Soon
        </h1>

>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        <p className="text-gray-600 mb-6">
          We are preparing interactive assessments for this grade.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go Back
        </button>
<<<<<<< HEAD
=======

>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      </div>
    )
  }

<<<<<<< HEAD
  // =========================
  // ✅ Main Assessment UI
  // =========================

=======
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  return (

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8">
        Class {type} Assessments
      </h1>

      <div className="space-y-10">

        {subjects.map(subject => (

<<<<<<< HEAD
          <div key={subject}>
=======
          <div key={subject.id}>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {subject.name}
            </h2>

<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
=======
            {subject.skills.length === 0 ? (

              <div className="bg-gray-50 border rounded-xl p-6">

                <h3 className="text-lg font-semibold">
                  🚧 Coming Soon
                </h3>
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

                <p className="text-gray-500 mt-2">
                  Assessments for this subject are being prepared.
                </p>

              </div>

<<<<<<< HEAD
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
=======
            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {subject.skills.map(skill => (

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
                      {skill.description || "Practice assessment"}
                    </p>

                    <div className="flex justify-between items-center">

                      <span className="text-xs text-gray-400">
                        Assessment
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

            )}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

          </div>

        ))}

      </div>

    </div>
  )
}

export default AssessmentPage;