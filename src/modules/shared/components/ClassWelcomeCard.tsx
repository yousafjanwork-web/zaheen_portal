const ClassWelcomeCard = ({ isUrdu, classInfo, subjects }: any) => {
    return (
        <div className="mb-12 p-8 md:p-10 rounded-3xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">

            <div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                    {isUrdu ? classInfo?.urdu_name : classInfo?.name}
                </h1>

                <p className="text-slate-600 mt-3 max-w-xl">
                    {isUrdu
                        ? "اس جماعت کے مضامین منتخب کریں اور ابواب اور اسباق سیکھنا شروع کریں۔"
                        : "Select a subject to explore chapters and lessons for this class. Interactive lessons designed to help students learn effectively."}
                </p>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow">
                    {isUrdu
                        ? `${subjects.length} مضامین`
                        : `${subjects.length} Subjects`}
                </div>

                <span className="text-xs text-slate-500">
                    {isUrdu ? "دستیاب مضامین" : "Available Subjects"}
                </span>
            </div>
        </div>
    );
};

export default ClassWelcomeCard;


// const ClassWelcomeCard = ({ isUrdu, classInfo, onMenuClick }: any) => {
//   return (
//     <header className="mb-12 flex justify-between items-center">

//       <div>

//         <div className="flex items-center gap-3 mb-2">

//           {/* MOBILE MENU BUTTON */}
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden bg-white shadow px-3 py-2 rounded-lg"
//           >
//             ☰
//           </button>

//           <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
//             {classInfo?.name}
//           </span>
//         </div>

//         <h1 className="text-3xl md:text-4xl font-extrabold">
//           {isUrdu ? "دستیاب مضامین" : "Available Subjects"}
//         </h1>

//         <p className="text-sm text-slate-500">
//           {isUrdu ? classInfo?.urdu_name : ""}
//         </p>
//       </div>

//       {/* Progress */}
//       <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-xl shadow">
//         <div>
//           <p className="text-xs text-slate-500">Progress</p>
//           <p className="font-bold text-blue-600">0%</p>
//         </div>

//         <div className="w-14 h-14 rounded-full border-4 border-blue-200 flex items-center justify-center">
//           <span className="text-sm font-bold">0%</span>
//         </div>
//       </div>

//     </header>
//   );
// };