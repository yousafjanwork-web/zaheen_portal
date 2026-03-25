export interface Option {
  id: number
  option_text: string
}

export interface Question {
  id: number
  prompt: string
  options: Option[]
}

export interface SubmitResponse {
  correct: boolean
}