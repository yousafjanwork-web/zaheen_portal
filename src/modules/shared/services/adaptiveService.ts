import axios from "axios"
import { SubmitPayload } from "../types/adaptive"
const API = "https://api.zaheen.com.pk/api/adaptive"

export const getAllSkills = async () => {

  console.log("Fetching Skills")

  const res = await axios.get(`${API}/all-skills`)

  console.log("Skills Response:", res.data)

  return res.data.data
}


export const getNextQuestion = async (
  studentId: number,
  skillId:number
) => {

  console.log("GET Question", studentId, skillId)

  const res = await axios.get(`${API}/next`, {
    params: { studentId, skillId }
  })

  console.log("Question Response:", res.data.prompt, res)

  return res.data
}


export const submitAnswer = async (payload: SubmitPayload) => {

  console.log("Submit Payload:", payload)

  const res = await axios.post(`${API}/submit`, payload)

  console.log("Submit Response:", res.data)

  return res.data
}