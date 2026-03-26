import axios from "axios"
import { SubmitPayload } from "../types/adaptive"
const API = "https://zai.zaheen.com.pk/api/adaptive"

export const getAllSkills = async () => {

  console.log("Fetching Skills")

  const res = await axios.get(`${API}/all-skills`)

  console.log("Skills Response:", res.data)

  return res.data.data
}


export const getNextQuestion = async (
  studentId: number,
  chapterId: number,
  skillId:number
) => {

  console.log("GET Question", studentId, chapterId, skillId)

  const res = await axios.get(`${API}/next`, {
    params: { studentId, chapterId, skillId }
  })

  console.log("Question Response:", res.data)

  return res.data
}


export const submitAnswer = async (payload: SubmitPayload) => {

  console.log("Submit Payload:", payload)

  const res = await axios.post(`${API}/submit`, payload)

  console.log("Submit Response:", res.data)

  return res.data
}