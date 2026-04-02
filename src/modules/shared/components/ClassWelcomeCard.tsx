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