import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { Link } from "react-router-dom";

const LecturesPage = () => {

  const { chapterId, chapterName } = useParams();
  const location = useLocation();

  const classTitle = location.state?.classTitle || "Course";

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const videoRef = useRef(null);

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  /* ---------------- TRACKING FUNCTION ---------------- */

  const trackEvent = (eventName, extra = {}) => {
    if (!window.gtag || !selectedVideo) return;

    window.gtag("event", eventName, {
      video_id: selectedVideo.id,
      video_name: selectedVideo.name,
      chapter_id: chapterId,
      page_path: window.location.pathname,
      ...extra
    });
  };

  /* ---------------- VIDEO EVENTS ---------------- */

  const handlePlay = () => {
    trackEvent("video_start");
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

      const res = await fetch(
        `https://api.zaheen.com.pk/api/chapter/${chapterId}/videos`
      );

      const data = await res.json();

      setVideos(data);

      if (data.length > 0) {
        setSelectedVideo(data[0]);
        setVideoUrl(
          `https://cdn.zaheen.com.pk/videos/${data[0].path}`
        );
      }

    };

    fetchVideos();

  }, [chapterId]);

  /* ---------------- CHANGE VIDEO ---------------- */

  const changeVideo = (video) => {

    setSelectedVideo(video);

    if (videoRef.current) {
      videoRef.current._tracked50 = false; // reset progress tracking
    }

    setVideoUrl(
      `https://cdn.zaheen.com.pk/videos/${video.path}`
    );

  };

  /* ---------------- KEYBOARD NAVIGATION ---------------- */

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

        <div className="mb-6 text-sm text-slate-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-primary">
            {isUrdu ? "ہوم" : "Home"}
          </Link>

          <span>/</span>

          <Link
            to={`/grade-view/${location.state?.gradeType}`}
            className="hover:text-primary"
          >
            {isUrdu ? "گریڈ" : "Grade"} {location.state?.gradeType}
          </Link>

          <span>/</span>

          <Link
            to={`/class/${location.state?.classId}`}
            state={{
              gradeType: location.state?.gradeType,
              selectedSubjectId: location.state?.selectedSubjectId,
            }}
            className="hover:text-primary"
          >
            {classTitle} - Chapters
          </Link>

          <span>/</span>

          <span className="text-slate-700 font-medium">{chapterName}</span>
        </div>

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-slate-900">
            {classTitle} | {chapterName}
          </h1>

          <p className="text-sm text-slate-500">
            {isUrdu
              ? "لیکچرز دیکھیں اور سیکھنا جاری رکھیں"
              : "Watch lectures and continue learning"}
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
                    onPlay={handlePlay}
                    onEnded={handleEnded}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full"
                    src={videoUrl}
                  />

                ) : (

                  <div className="flex items-center justify-center h-full text-white">
                    {isUrdu ? "ویڈیو لوڈ ہو رہی ہے..." : "Loading video..."}
                  </div>

                )}

              </div>

            </div>

            {/* VIDEO INFO */}

            {selectedVideo && (

              <div className="mt-4 bg-white rounded-2xl p-5 border">

                <h2 className="text-xl font-bold">
                  {isUrdu
                    ? selectedVideo.urdu_name || selectedVideo.name
                    : selectedVideo.name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {isUrdu
                    ? selectedVideo.urdu_desc || selectedVideo.desc
                    : selectedVideo.desc}
                </p>

                <div className="mt-3 text-xs text-slate-400">
                  {currentIndex + 1} / {videos.length}
                </div>

              </div>

            )}

          </div>

          {/* PLAYLIST */}

          <aside className="w-full lg:w-80 bg-white rounded-2xl border overflow-hidden">

            <div className="p-4 border-b font-semibold">
              {isUrdu ? "لیکچرز" : "Lectures"} ({videos.length})
            </div>

            <div className="max-h-[70vh] overflow-y-auto">

              {videos.map((video, index) => (

                <div
                  key={video.id}
                  onClick={() => changeVideo(video)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b hover:bg-slate-50
                  ${selectedVideo?.id === video.id ? "bg-indigo-50" : ""}`}
                >

                  <PlayCircle
                    size={18}
                    className={`${selectedVideo?.id === video.id
                      ? "text-indigo-600"
                      : "text-slate-400"}`}
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

export default LecturesPage;