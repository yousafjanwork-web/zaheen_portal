import { useParams, useNavigate, Link } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";
import { useAuth } from "@/modules/shared/context/AuthContext";
import Sidebar from "@/modules/shared/components/GradeView/SideBar";
import GradeCard from "@/modules/shared/components/GradeView/GradeCard";
import { useGrades } from "@/modules/shared/hooks/useGrade";
import Loader from "@/modules/shared/components/Loader";
import GradeCardSkeleton from "@/modules/shared/components/GradeView/GradeCardSkeleton";
import WelcomeCard from "@/modules/shared/components/GradeView/WelcomeCard";

const welcomeTitles: any = {
  kg: { en: "KG", ur: "کے جی" },
  "1-5": { en: "Grades 1-5", ur: "گریڈ ۱-۵" },
  "6-8": { en: "Grades 6-8", ur: "گریڈ ۶-۸" },
  "9-12": { en: "Grades 9-12", ur: "گریڈ ۹-۱۲" },
  "k-12": { en: "K-12 Curriculum", ur: "کے-۱۲ نصاب" },
};

const GradesView = () => {
  const { type }: any = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  const { grades, loading } = useGrades(type, isUrdu);

  const title = welcomeTitles[type] || welcomeTitles["1-5"];

  return (
    <section className="py-20 bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500 flex gap-2">
          <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">
            {isUrdu ? title.ur : title.en}
          </span>
        </div>

        <WelcomeCard isUrdu={isUrdu} title={title} />

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-10">
          <Sidebar
            isLoggedIn={isLoggedIn}
            isUrdu={isUrdu}
            type={type}
            navigate={navigate}
          />

          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GradeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {grades.map((g, i) => (
                  <GradeCard key={i} grade={g} navigate={navigate} type={type} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GradesView;