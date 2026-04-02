const GradeCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-5 border animate-pulse">
      <div className="h-30 rounded-2xl bg-slate-200 mb-4"></div>

      <div className="h-5 bg-slate-200 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-3"></div>

      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-200 rounded"></div>
        <div className="h-6 w-12 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};

export default GradeCardSkeleton;