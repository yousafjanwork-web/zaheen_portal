import { LayoutDashboard, BookOpen, FileText, FolderOpen, Settings } from "lucide-react";

const Sidebar = ({ isLoggedIn, isUrdu, type, navigate }: any) => {
  return (
    <aside className="w-full lg:w-64 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2">
            <div className="p-3 rounded-xl bg-primary text-white flex items-center gap-3 flex-shrink-0">
              <LayoutDashboard size={18} />
              {isUrdu ? "ڈیش بورڈ" : "Dashboard"}
            </div>


            {isLoggedIn && (
              <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0">
                <BookOpen size={18} />
                {isUrdu ? "میرے کورسز" : "My Courses"}
              </div>
            )}

            <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0">
              <FileText size={18} />
              {isUrdu ? "امتحانات" : "Assessments"}
            </div>

            <div
              onClick={() => {
                if (type === "9-12") {
                  navigate("/resources?type=9-12");
                } else {
                  navigate(`/practice?section=${type}`);
                }
              }}
              className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0"
            >
              <FolderOpen size={18} />
              {isUrdu ? "وسائل" : "Resources"}
            </div>

            {isLoggedIn && (
              <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0">
                <Settings size={18} />
                {isUrdu ? "ترتیبات" : "Settings"}
              </div>
            )}
          </aside>
  );
};

export default Sidebar;




// import React, { useEffect, useState } from "react";
// import {
//   LayoutDashboard,
//   BookOpen,
//   FileText,
//   FolderOpen,
//   Settings,
// } from "lucide-react";
// import { motion } from "motion/react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getLanguage } from "@/modules/shared/i18n";
// import { useAuth } from "@/modules/shared/context/AuthContext";
// import { Link, useLocation } from "react-router-dom";
// /* ---------- WELCOME TITLES ---------- */

// const welcomeTitles = {
//   kg: { en: "KG", ur: "کے جی" },
//   "1-5": { en: "Grades 1-5", ur: "گریڈ ۱-۵" },
//   "6-8": { en: "Grades 6-8", ur: "گریڈ ۶-۸" },
//   "9-12": { en: "Grades 9-12", ur: "گریڈ ۹-۱۲" },
//   "k-12": { en: "K-12 Curriculum", ur: "کے-۱۲ نصاب" }
// };
// const gradeImages: any = {
//   7: "https://images.unsplash.com/photo-1588072432836-e10032774350",
//   8: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
//   9: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
//   10: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
//   11: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
//   12: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
//   13: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
// };


// const GradesView = () => {
//   const { type }: any = useParams();
//   const navigate = useNavigate();

//   const { msisdn, login, isLoggedIn } = useAuth();

//   const [grades, setGrades] = useState<any[]>([]);

//   /* ---------- LANGUAGE ---------- */

//   const lang = getLanguage();
//   const isUrdu = lang === "ur";

//   const title = welcomeTitles[type] || welcomeTitles["1-5"];


//   const breadcrumbMap = {
//     kg: isUrdu ? "کے جی" : "KG",
//     "1-5": isUrdu ? "گریڈ ۱-۵" : "Grades 1-5",
//     "6-8": isUrdu ? "گریڈ ۶-۸" : "Grades 6-8",
//     "9-12": isUrdu ? "گریڈ ۹-۱۲" : "Grades 9-12",
//     "k-12": isUrdu ? "کے-۱۲ نصاب" : "K-12 Curriculum",
//   };



//   /* ---------- API ---------- */

//   useEffect(() => {
//     const fetchGrades = async () => {
//       try {
//         const res = await fetch(
//           "https://api.zaheen.com.pk/api/board/1/classes"
//         );
//         const data = await res.json();

//         // Replace this section in your useEffect
//         let filtered: any[] = [];

//         if (type === "kg") filtered = data.filter((g: any) => g.id === 1);
//         else if (type === "1-5") filtered = data.filter((g: any) => g.id >= 2 && g.id <= 6);
//         else if (type === "6-8") filtered = data.filter((g: any) => g.id >= 7 && g.id <= 9);
//         else if (type === "9-12") filtered = data.filter((g: any) => g.id >= 10 && g.id <= 13);
//         else if (type === "k-12") filtered = data; // <-- show all grades
//         else filtered = data.filter((g: any) => g.id >= 2 && g.id <= 6); // default fallback


//         const gradesWithSubjects = await Promise.all(
//           filtered.map(async (g: any) => {
//             try {
//               const subjectRes = await fetch(
//                 `https://api.zaheen.com.pk/api/class/${g.id}/subjects`
//               );
//               const subjectData = await subjectRes.json();

//               const subjectNames = subjectData.map((s: any) =>
//                 isUrdu ? s.urdu_name || s.name : s.name
//               );

//               return {
//                 id: g.id,
//                 title: isUrdu ? g.urdu_name : g.name,
//                 lessons: isUrdu
//                   ? `${subjectNames.length} مضامین`
//                   : `${subjectNames.length} Subjects`,
//                 description: isUrdu
//                   ? "طلباء کے لیے اعلیٰ معیار کا تعلیمی مواد۔"
//                   : "High-quality educational content designed for students.",
//                 image: gradeImages[g.id] || g.thumbnailUrl,
//                 subjects: subjectNames,
//               };
//             } catch (err) {
//               console.error("Subject API Error:", err);

//               return {
//                 id: g.id,
//                 title: isUrdu ? g.urdu_name : g.name,
//                 lessons: isUrdu ? "0 مضامین" : "0 Subjects",
//                 description: isUrdu
//                   ? "طلباء کے لیے اعلیٰ معیار کا تعلیمی مواد۔"
//                   : "High-quality educational content designed for students.",
//                 image: g.thumbnailUrl,
//                 subjects: [],
//               };
//             }
//           })
//         );

//         setGrades(gradesWithSubjects);
//       } catch (error) {
//         console.error("Grades API Error:", error);
//       }
//     };

//     fetchGrades();
//   }, [type, isUrdu]);

//   return (
//     <section className="py-20 bg-slate-50">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* ================== BREADCRUMBS ================== */}


//         <div className="mb-6 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
//           <Link to="/" className="hover:text-primary">
//             {isUrdu ? "ہوم" : "Home"}
//           </Link>

//           <span>/</span>

//           <span className="text-slate-700 font-medium">
//             {breadcrumbMap[type] || "Grades"}
//           </span>
//         </div>


//         {/* ---------- WELCOME ---------- */}

//         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/10">
//           <div className="text-center md:text-left">
//             <h1 className="text-4xl md:text-5xl font-black text-slate-900">
//               {isUrdu ? title.ur : title.en}
//             </h1>

//             <p className="text-lg text-slate-600 mt-2 max-w-2xl">
//               {isUrdu
//                 ? "انگریزی اور اردو میں سیکھنا شروع کرنے کے لیے اپنے گریڈ کا انتخاب کریں۔"
//                 : "Select your grade to start learning."}
//             </p>
//           </div>

//           <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition">
//             {isUrdu ? "تمام کورسز دیکھیں" : "Explore All Courses"}
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* ---------- SIDEBAR ---------- */}

//           <aside className="w-full lg:w-64 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2">
//             <div className="p-3 rounded-xl bg-primary text-white flex items-center gap-3 flex-shrink-0">
//               <LayoutDashboard size={18} />
//               {isUrdu ? "ڈیش بورڈ" : "Dashboard"}
//             </div>


//             {isLoggedIn && (
//               <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0">
//                 <BookOpen size={18} />
//                 {isUrdu ? "میرے کورسز" : "My Courses"}
//               </div>
//             )}

//             <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0">
//               <FileText size={18} />
//               {isUrdu ? "امتحانات" : "Assessments"}
//             </div>

//             <div
//               onClick={() => {
//                 if (type === "9-12") {
//                   navigate("/resources?type=9-12");
//                 } else {
//                   navigate(`/practice?section=${type}`);
//                 }
//               }}
//               className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0"
//             >
//               <FolderOpen size={18} />
//               {isUrdu ? "وسائل" : "Resources"}
//             </div>

//             {isLoggedIn && (
//               <div className="p-3 rounded-xl hover:bg-slate-100 flex items-center gap-3 cursor-pointer flex-shrink-0">
//                 <Settings size={18} />
//                 {isUrdu ? "ترتیبات" : "Settings"}
//               </div>
//             )}
//           </aside>

//           {/* ---------- GRADES ---------- */}

//           <div className="flex-1">
//             <h2 className="text-2xl font-bold mb-8">
//               {isUrdu
//                 ? "اپنے گریڈ کا انتخاب کریں"
//                 : "Select Your Grade"}
//             </h2>

//             <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {grades.map((grade, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ y: -8 }}
//                   transition={{ duration: 0.25 }}
//                   onClick={() =>
//                     navigate(`/class/${grade.id}`, {
//                       state: {
//                         gradeType: type,   // 🔥 critical
//                       },
//                     })
//                   } className="bg-white rounded-3xl p-5 border hover:border-primary/50 shadow-sm hover:shadow-xl cursor-pointer"
//                 >
//                   <div className="h-30 rounded-2xl overflow-hidden mb-4 relative">
//                     <img
//                       src={grade.image}
//                       alt={grade.title}
//                       className={`w-full h-full ${grade.id <= 6
//                         ? "object-contain bg-slate-50 p-2"
//                         : "object-cover"
//                         }`}
//                     />

//                     <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-primary border">
//                       {grade.lessons}
//                     </div>
//                   </div>

//                   <h3 className="text-xl font-bold text-slate-900 mb-1">
//                     {grade.title}
//                   </h3>

//                   <p className="text-sm text-slate-500 mb-4">
//                     {grade.description}
//                   </p>

//                   <div className="flex flex-wrap gap-2 text-xs">
//                     {grade.subjects.map((subject: string, i: number) => (
//                       <span
//                         key={i}
//                         className="px-3 py-1 bg-slate-100 rounded-lg"
//                       >
//                         {subject}
//                       </span>
//                     ))}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default GradesView;