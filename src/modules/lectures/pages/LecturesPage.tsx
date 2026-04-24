import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { useSearchParams } from "react-router-dom";

const LecturesPage = () => {
  const { chapterId, chapterName } = useParams();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const queryVideoId = searchParams.get("videoId");

  const classTitle = location.state?.classTitle || "Course";
  const gradeType = location.state?.gradeType;

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loadingVideos, setLoadingVideos] = useState(true);

  const videoRef = useRef(null);

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  /* ---------------- TRACKING ---------------- */

  const trackEvent = (eventName, extra = {}) => {
    if (!window.gtag || !selectedVideo) return;

    window.gtag("event", eventName, {
      video_id: selectedVideo.id,
      video_name: selectedVideo.name,
      chapter_id: chapterId,
      page_path: window.location.pathname,
      ...extra,
    });
  };

  /* ---------------- VIDEO EVENTS ---------------- */

  const handleLoaded = () => {
    if (!videoRef.current || videoRef.current._started) return;
    videoRef.current._started = true;
    trackEvent("video_start");
  };

  const handlePlay = () => {
    if (!videoRef.current?._started) {
      videoRef.current._started = true;
      trackEvent("video_start");
    }
  };

  const handleEnded = () => {
    trackEvent("video_complete");

    const index = videos.findIndex(v => v.id === selectedVideo.id);
    if (index < videos.length - 1) {
      changeVideo(videos[index + 1]);
    }
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (!video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;

    if (percent > 50 && !video._tracked50) {
      video._tracked50 = true;
      trackEvent("video_50_percent");
    }
  };

  /* ---------------- FETCH VIDEOS ---------------- */

  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideos(true);

      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/chapter/${chapterId}/videos?ts=${Date.now()}`
        );

        const data = await res.json();

        setVideos(data);

        const initialVideoId =
          queryVideoId ||
          location.state?.autoPlayVideoId ||
          location.state?.videoId;


        const initialVideo =
          data.find(v => String(v.id) === String(initialVideoId))
          
        if (initialVideo) {
          setSelectedVideo(initialVideo);
          setVideoUrl(`https://cdn.zaheen.com.pk/videos/${initialVideo.path}`);
        }
      } catch (err) {
        console.error(err);
      }

      setLoadingVideos(false);
    };

    console.log(location.state.gradeType, "grade ytpe")

    fetchVideos();


  }, [chapterId]);

  /* ---------------- CHANGE VIDEO ---------------- */

  const changeVideo = (video) => {
    setSelectedVideo(video);

    if (videoRef.current) {
      videoRef.current._tracked50 = false;
      videoRef.current._started = false;
    }

    setVideoUrl(`https://cdn.zaheen.com.pk/videos/${video.path}`);
  };

  /* ---------------- KEYBOARD NAV ---------------- */

  useEffect(() => {
    const handleKey = (e) => {
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
    <section className="bg-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* BREADCRUMB */}
        <div className="mb-6 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
          <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
          <span>/</span>

          {
            gradeType === "Skills" ?
              <Link to={`/skills/${location.state?.classId}`}>
                {classTitle} - Skills
              </Link>
              :
              <Link to={`/class/${location.state?.classId}`}>
                {classTitle} - Lectures
              </Link>
          }


          <span>/</span>
          <span className="text-slate-700 font-medium">{chapterName}</span>
        </div>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {classTitle} | {chapterName}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* VIDEO PLAYER */}
          <div className="flex-1">

            <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-video">

                {loadingVideos ? (
                  <div className="flex items-center justify-center h-full text-white">
                    {isUrdu ? "لوڈ ہو رہا ہے..." : "Loading..."}
                  </div>
                ) : videoUrl ? (
                  <video
                    ref={videoRef}
                    key={videoUrl}
                    controls
                    autoPlay
                    onLoadedData={handleLoaded}
                    onPlay={handlePlay}
                    onEnded={handleEnded}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full"
                    src={videoUrl}
                    onError={(e) => console.log("VIDEO ERROR", e)}
                    onLoadedMetadata={(e) => {
                      const v = e.target;
                      console.log("Resolution:", v.videoWidth, v.videoHeight);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    {isUrdu ? "ویڈیو دستیاب نہیں" : "No video available"}
                  </div>
                )}

              </div>
            </div>

            {/* VIDEO INFO */}
            {loadingVideos ? (
              <div className="mt-4 bg-white rounded-2xl p-5 border animate-pulse">
                <div className="h-5 w-40 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-60 bg-slate-200 rounded"></div>
              </div>
            ) : selectedVideo ? (
              <div className="mt-4 bg-white rounded-2xl p-5 border">

                <h2 className="text-xl font-bold">
                  {isUrdu
                    ? selectedVideo.urdu_name || selectedVideo.name
                    : selectedVideo.name}
                </h2>

                {/* ✅ PIPE FIX HERE */}
                {(() => {
                  const fullText = isUrdu
                    ? selectedVideo.urdu_desc || selectedVideo.desc
                    : selectedVideo.desc;

                  if (!fullText) return null;

                  const parts = fullText
                    .split("|")
                    .map(p => p.trim())
                    .filter(Boolean);

                  const firstPart = parts[0];
                  const rest = parts.slice(1);

                  return (
                    <>
                      {/* ✅ FIRST → normal text */}
                      <p className="text-base text-slate-600 mt-2">
                        <b>{firstPart}</b>
                      </p>

                      {/* ✅ Remaining */}
                      {rest.map((line, i) => {
                        const isNormalLine = line.startsWith("-");

                        if (isNormalLine) {
                          return (
                            <p key={i} className="text-base font-semibold text-slate-700 mt-2">
                              {line.replace("-", "").trim()}
                            </p>
                          );
                        }

                        return (
                          <ul
                            key={i}
                            className="text-base text-slate-600 mt-2 space-y-1 list-disc pl-5"
                          >
                            <li>{line}</li>
                          </ul>
                        );
                      })}
                    </>
                  );
                })()}

                <div className="mt-3 text-xs text-slate-400">
                  {currentIndex + 1} / {videos.length}
                </div>

              </div>
            ) : (
              <div className="mt-4 bg-white rounded-2xl p-5 border text-center">
                {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
              </div>
            )}

          </div>

          {/* PLAYLIST */}
          <aside className="w-full lg:w-80 bg-white rounded-2xl border overflow-hidden">

            <div className="p-4 border-b font-semibold">
              {isUrdu ? "لیکچرز" : "Lectures"}{" "}
              {!loadingVideos && `(${videos.length})`}
            </div>

            <div className="max-h-[70vh] overflow-y-auto">

              {loadingVideos ? (
                [...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 border-b animate-pulse"
                  >
                    <div className="w-4 h-4 bg-slate-200 rounded" />
                    <div className="h-3 w-32 bg-slate-200 rounded" />
                  </div>
                ))
              ) : videos.length > 0 ? (
                videos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => changeVideo(video)}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b hover:bg-slate-50
                    ${selectedVideo?.id === video.id ? "bg-indigo-50" : ""}`}
                  >
                    <PlayCircle
                      size={18}
                      className={
                        selectedVideo?.id === video.id
                          ? "text-indigo-600"
                          : "text-slate-400"
                      }
                    />

                    <span className="text-sm font-medium">
                      {index + 1}.{" "}
                      {isUrdu
                        ? video.urdu_name || video.name
                        : video.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">
                  {isUrdu ? "لیکچرز دستیاب نہیں" : "No lectures available"}
                </div>
              )}

            </div>

          </aside>

        </div>

      </div>
    </section>
  );
};

export default LecturesPage;