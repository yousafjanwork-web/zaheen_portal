import axios from "axios"

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("zaheen_auth")
    return raw ? (JSON.parse(raw).token ?? null) : null
  } catch { return null }
}

const quizHttp = axios.create()

quizHttp.interceptors.request.use(cfg => {
  const token = getAuthToken()
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default quizHttp