import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getLanguage } from "@/i18n";

const LecturesPage = () => {
  const { chapterId, chapterName }: any = useParams();
  const location = useLocation();

  const classTitle = location.state?.classTitle || "Class";

  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const videoPlayerRef = useRef<any>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  /* ---------- LANGUAGE ---------- */

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  /* ---------- FETCH VIDEOS ---------- */

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/chapter/${chapterId}/videos`
        );
        const data = await res.json();

        setVideos(data);

        if (data.length > 0) {
          setSelectedVideo(data[0]);
          setVideoUrl(
            `https://api.zaheen.com.pk/api/playvideo/${data[0].id}`
          );
        }
      } catch (err) {
        console.error("Error fetching lectures:", err);
      }
    };

    fetchVideos();
  }, [chapterId]);

  /* ---------- SIDEBAR HEIGHT ---------- */

  useEffect(() => {
    const updateHeight = () => {
      if (videoPlayerRef.current) {
        setSidebarHeight(videoPlayerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [videoUrl]);

  const changeVideo = (video: any) => {
    setSelectedVideo(video);
    setVideoUrl(
      `https://api.zaheen.com.pk/api/playvideo/${video.id}`
    );
  };

  return (
    <section className="py-16 bg-yellow-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------- WELCOME ---------- */}

        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-100 border border-green-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              {classTitle}
              <span className="text-green-600 font-bold mx-2">|</span>
              {chapterName}
            </h1>

            <p className="text-sm text-slate-600 mt-1">
              {isUrdu
                ? "لیکچرز دیکھیں اور اپنی تعلیم جاری رکھیں۔"
                : "Watch lectures and continue learning."}
            </p>
          </div>

          <div className="text-sm bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
            {isUrdu
              ? `${videos.length} لیکچرز`
              : `${videos.length} ${
                  videos.length === 1 ? "Lecture" : "Lectures"
                }`}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ---------- SIDEBAR ---------- */}

          <aside
            className="p-2 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col lg:w-80 flex-shrink-0"
            style={{ maxHeight: sidebarHeight }}
          >
            {videos.length > 0 ? (
              videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => changeVideo(video)}
                  className={`flex items-center p-4 rounded-2xl cursor-pointer border transition-all duration-300
                  ${
                    selectedVideo?.id === video.id
                      ? "bg-green-600 text-white border-green-600 shadow-2xl scale-105"
                      : "bg-white hover:bg-green-50 hover:scale-105 border-gray-200"
                  }
                  flex-shrink-0 min-w-[180px] lg:min-w-0`}
                >
                  <span className="text-2xl flex-shrink-0 mr-3">📺</span>

                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-semibold break-words">
                      {isUrdu
                        ? video.urdu_name || video.name
                        : video.name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-yellow-100 border-dashed border-2 border-yellow-400 text-yellow-800 text-center font-semibold min-w-[180px]">
                {isUrdu ? (
                  <>
                    🎬 جلد آرہا ہے! <br />
                    لیکچرز جلد شامل کیے جائیں گے۔
                  </>
                ) : (
                  <>
                    🎬 Coming Soon! <br />
                    Lectures will be added shortly.
                  </>
                )}
              </div>
            )}
          </aside>

          {/* ---------- VIDEO PLAYER ---------- */}

          <div className="flex-1" ref={videoPlayerRef}>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="aspect-video bg-black">
                {videoUrl ? (
                  <video
                    key={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    src={videoUrl}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    {isUrdu ? "ویڈیو لوڈ ہو رہی ہے..." : "Loading Video..."}
                  </div>
                )}
              </div>

              {selectedVideo && (
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900">
                    {isUrdu
                      ? selectedVideo.urdu_name || selectedVideo.name
                      : selectedVideo.name}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {isUrdu
                      ? `یہ لیکچر ${chapterName} کے لیے ہے`
                      : `Lecture for ${chapterName}`}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {isUrdu
                      ? selectedVideo.urdu_desc || selectedVideo.desc
                      : selectedVideo.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LecturesPage;