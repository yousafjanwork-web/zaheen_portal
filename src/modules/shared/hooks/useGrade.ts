import { useEffect, useState } from "react";
import { fetchGrades, fetchSubjectsByClass } from "@/modules/shared/services/gradeService";

const gradeImages: Record<number, string> = {
  7: "https://images.unsplash.com/photo-1588072432836-e10032774350",
  8: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
  9: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
  10: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  11: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
  12: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  13: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
};

const filterGrades = (data: any[], type: string) => {
  if (type === "kg") return data.filter(g => g.id === 1);
  if (type === "1-5") return data.filter(g => g.id >= 2 && g.id <= 6);
  if (type === "6-8") return data.filter(g => g.id >= 7 && g.id <= 9);
  if (type === "9-12") return data.filter(g => g.id >= 10 && g.id <= 13);
  if (type === "k-12") return data;
  return data.filter(g => g.id >= 2 && g.id <= 6);
};

export const useGrades = (type: string, isUrdu: boolean) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGrades();
        const filtered = filterGrades(data, type);

        const result = await Promise.all(
          filtered.map(async (g) => {
            try {
              const subjects = await fetchSubjectsByClass(g.id);

              const subjectNames = subjects.map((s: any) =>
                isUrdu ? s.urdu_name || s.name : s.name
              );

              return {
                id: g.id,
                title: isUrdu ? g.urdu_name : g.name,
                lessons: `${subjectNames.length} ${isUrdu ? "مضامین" : "Subjects"}`,
                description: isUrdu
                  ? "طلباء کے لیے اعلیٰ معیار کا تعلیمی مواد۔"
                  : "High-quality educational content designed for students.",
                image: gradeImages[g.id] || g.thumbnailUrl,
                subjects: subjectNames,
              };
            } catch {
              return {
                id: g.id,
                title: isUrdu ? g.urdu_name : g.name,
                lessons: `0 ${isUrdu ? "مضامین" : "Subjects"}`,
                description: "",
                image: g.thumbnailUrl,
                subjects: [],
              };
            }
          })
        );

        setGrades(result);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, isUrdu]);

  return { grades, loading };
};