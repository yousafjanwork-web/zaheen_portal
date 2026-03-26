export interface Option {
  id: number
  option_text: string
}

export interface Question {
  id: number
  prompt: string
  options: Option[]
}


export interface SubmitPayload {
  studentId: number
  questionId: number
  selectedOptionId: number
  timeTaken: number
}

export interface SubmitResponse {
  correct: boolean
}

export interface Skill {
  id: number
  name: string
  description: string
  created_at: string
}