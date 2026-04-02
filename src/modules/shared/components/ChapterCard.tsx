const ChapterCard = ({
    chapter,
    index,
    videos,
    navigate,
    classInfo,
    isUrdu,
    gradeType,
    classId,
    selectedSubject,
}: any) => {
    const displayVideos = videos?.slice(0, 4) || [];

    return (
        <div
            onClick={() =>
                navigate(`/lectures/${classInfo?.name}/${chapter.id}/${chapter.name}`, {
                    state: {
                        classTitle: isUrdu ? classInfo?.urdu_name : classInfo?.name,
                        gradeType,
                        classId,
                        selectedSubjectId: selectedSubject?.id,
                    },
                })
            }
            className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
        >
            <div className="w-16 h-16 bg-blue-100 flex items-center justify-center rounded-xl">
                📘
            </div>

            <div className="flex-1">
                <h4 className="font-bold text-slate-900">
                    Chapter {index + 1}:{" "}
                    {isUrdu ? chapter.urdu_name || chapter.name : chapter.name}
                </h4>

                {/* 🔥 VIDEOS LIST (RESTORED) */}
                <div className="mt-2 ml-1 space-y-1">

                    {/* COUNT */}
                    {videos?.length > 0 && (
                        <div className="text-[11px] text-blue-600 font-semibold mb-1">
                            {isUrdu
                                ? `${videos.length} لیکچرز`
                                : `${videos.length} Lectures`}
                        </div>
                    )}

                    {/* FIRST 4 VIDEOS */}
                    {displayVideos.map((video: any) => (
                        <div
                            key={video.id}
                            className="text-xs text-slate-600 hover:text-blue-600 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    `/lectures/${classInfo?.name}/${chapter.id}/${chapter.name}`,
                                    {
                                        state: {
                                            classTitle: isUrdu
                                                ? classInfo?.urdu_name
                                                : classInfo?.name,
                                            gradeType,
                                            classId,
                                            selectedSubjectId: selectedSubject?.id,
                                            videoId: video.id,
                                        },
                                    }
                                );
                            }}
                        >
                            • {isUrdu
                                ? video.urdu_name || video.name
                                : video.name}
                        </div>
                    ))}

                    {/* ... IF MORE */}
                    {videos?.length > 4 && (
                        <div className="text-xs text-slate-400 font-semibold">
                            ...
                        </div>
                    )}
                </div>

                <p className="text-xs text-blue-600 font-semibold mt-2">
                    {isUrdu ? "لیکچرز دیکھیں →" : "View Lectures →"}
                </p>
            </div>
        </div>
    );
};

export default ChapterCard;