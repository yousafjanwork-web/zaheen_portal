import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";

const ResourcePlayer = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const year = searchParams.get("year");

    const subjectName = location.state?.subjectName || "Subject";

    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [videoUrl, setVideoUrl] = useState("");

    const videoRef = useRef<any>(null);

    const lang = getLanguage();
    const isUrdu = lang === "ur";

    /* ---------------- FETCH PAST PAPERS ---------------- */

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(
                    `https://api.zaheen.com.pk/api/pastpapers/subject/${subject}/year/${year}`
                );

                console.log(res)

                const data = await res.json();
                const list = data.data || [];
                console.log(data);

                setVideos(list);

                if (list.length > 0) {
                    setSelectedVideo(list[0]);
                    setVideoUrl(
                        `https://api.zaheen.com.pk/api/playwsvideo/${list[0].id}`
                    );
                }
            } catch (err) {
                console.error("Error fetching past papers:", err);
            }
        };

        fetchVideos();
    }, [grade, subject, year]);

    /* ---------------- CHANGE VIDEO ---------------- */

    const changeVideo = (video: any) => {
        setSelectedVideo(video);

        setVideoUrl(
            `https://api.zaheen.com.pk/api/playwsvideo/${video.id}`
        );
    };

    /* ---------------- AUTO PLAY NEXT ---------------- */

    const handleEnded = () => {
        const index = videos.findIndex(v => v.id === selectedVideo?.id);

        if (index < videos.length - 1) {
            changeVideo(videos[index + 1]);
        }
    };

    /* ---------------- KEYBOARD NAVIGATION ---------------- */

    useEffect(() => {
        const handleKey = (e: any) => {
            const index = videos.findIndex(v => v.id === selectedVideo?.id);

            if (e.key === "ArrowRight" && index < videos.length - 1) {
                changeVideo(videos[index + 1]);
            }

            if (e.key === "ArrowLeft" && index > 0) {
                changeVideo(videos[index - 1]);
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [selectedVideo, videos]);

    const currentIndex = videos.findIndex(v => v.id === selectedVideo?.id);

    return (
        <section className="bg-slate-100 min-h-screen py-6 md:py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        {subjectName} | {year}
                    </h1>

                    <p className="text-sm text-slate-500">
                        {isUrdu
                            ? "پاسٹ پیپر ویڈیوز دیکھیں"
                            : "Watch past paper videos"}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* VIDEO PLAYER */}
                    <div className="flex-1">

                        <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
                            <div className="aspect-video">

                                {videoUrl ? (
                                    <video
                                        ref={videoRef}
                                        key={videoUrl}
                                        controls
                                        autoPlay
                                        onEnded={handleEnded}
                                        className="w-full h-full"
                                        src={videoUrl}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">
                                        Loading video...
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* VIDEO INFO */}
                        {selectedVideo && (
                            <div className="mt-4 bg-white rounded-2xl p-5 border">
                                <h2 className="text-lg md:text-xl font-bold">
                                    {isUrdu
                                        ? selectedVideo.urdu_name || selectedVideo.name
                                        : selectedVideo.name}
                                </h2>

                                <div className="mt-2 text-xs text-slate-400">
                                    {currentIndex + 1} / {videos.length}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PLAYLIST */}
                    <aside className="w-full lg:w-80 bg-white rounded-2xl border overflow-hidden">

                        <div className="p-4 border-b font-semibold">
                            {isUrdu ? "پاسٹ پیپرز" : "Past Papers"} ({videos.length})
                        </div>

                        <div className="max-h-[60vh] lg:max-h-[70vh] overflow-y-auto">

                            {videos.map((video, index) => (
                                <div
                                    key={video.id}
                                    onClick={() => changeVideo(video)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b hover:bg-slate-50
                  ${selectedVideo?.id === video.id
                                            ? "bg-indigo-50"
                                            : ""
                                        }`}
                                >

                                    <PlayCircle
                                        size={18}
                                        className={`${selectedVideo?.id === video.id
                                                ? "text-indigo-600"
                                                : "text-slate-400"
                                            }`}
                                    />

                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {index + 1}.{" "}
                                            {isUrdu
                                                ? video.urdu_name || video.name
                                                : video.name}
                                        </span>
                                    </div>

                                </div>
                            ))}

                        </div>
                    </aside>

                </div>
            </div>
        </section>
    );
};

export default ResourcePlayer;