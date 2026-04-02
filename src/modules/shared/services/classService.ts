const BASE_URL = "https://api.zaheen.com.pk/api";

export const fetchClasses = async () => {
  const res = await fetch(`${BASE_URL}/board/1/classes`);
  if (!res.ok) throw new Error("Classes fetch failed");
  return res.json();
};

export const fetchSubjects = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/class/${classId}/subjects`);
  if (!res.ok) throw new Error("Subjects fetch failed");
  return res.json();
};

export const fetchChapters = async (subjectId: number) => {
  const res = await fetch(`${BASE_URL}/subject/${subjectId}/chapters`);
  if (!res.ok) throw new Error("Chapters fetch failed");
  return res.json();
};

export const fetchVideos = async (chapterId: number) => {
  const res = await fetch(`${BASE_URL}/chapter/${chapterId}/videos`);
  if (!res.ok) throw new Error("Videos fetch failed");
  return res.json();
};