const BASE_URL = "https://api.zaheen.com.pk/api";

export const fetchGrades = async () => {
  const res = await fetch(`${BASE_URL}/board/1/classes`);
  if (!res.ok) throw new Error("Failed to fetch grades");
  return res.json();
};

export const fetchSubjectsByClass = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/class/${classId}/subjects`);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
};