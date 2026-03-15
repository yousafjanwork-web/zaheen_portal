import axios from "axios"

const API = "https://zai.zaheen.com.pk/api/adaptive"

export const getNextQuestion = async (
  studentId: number,
  chapterId: number
) => {

  console.log("GET Question", studentId, chapterId)

  const res = await axios.get(`${API}/next`, {
    params: { studentId, chapterId }
  })

  console.log("Question Response:", res.data)

  return res.data
}

export const submitAnswer = async (payload: any) => {

  console.log("Submit Payload:", payload)

  const res = await axios.post(`${API}/submit`, payload)

  console.log("Submit Response:", res.data)

  return res.data
}