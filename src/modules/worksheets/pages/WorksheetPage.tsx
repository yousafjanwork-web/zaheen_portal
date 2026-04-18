import React, { useEffect, useState } from "react";
import { Sparkles, FileText, Download } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";

import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";

import * as pdfjs from "pdfjs-dist/build/pdf";

const workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const WorksheetsPage = () => {

  const { subjectId } = useParams();
  const location = useLocation();
  const subject = location.state?.subject;

  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState<any>(null);

  // ✅ NEW: Blob URL state
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();

  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;
  const { EnterFullScreenButton } = fullScreenPluginInstance;

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  /* ---------------- FETCH WORKSHEETS ---------------- */

  useEffect(() => {
    const fetchWorksheets = async () => {
      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/chapter/${subjectId}/worksheets`
        );

        const data = await res.json();

        setWorksheets(data);

        if (data.length > 0) {
          setSelectedWorksheet(data[0]);
        }

      } catch (err) {
        console.error("Worksheet API error", err);
      }
    };

    fetchWorksheets();
  }, [subjectId]);

  /* ---------------- LOAD PDF AS BLOB (ONLY ONCE PER FILE) ---------------- */

  useEffect(() => {
    const loadPdf = async () => {
      if (!selectedWorksheet) return;

      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/getpdf/${selectedWorksheet.id}`
        );

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        setPdfBlobUrl(url);
      } catch (err) {
        console.error("PDF load error:", err);
      }
    };

    loadPdf();

    // ✅ CLEANUP (IMPORTANT)
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };

  }, [selectedWorksheet]);

  /* ---------------- DOWNLOAD FROM BLOB ---------------- */

  const handleDownload = () => {
    if (!pdfBlobUrl) return;

    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download =
      selectedWorksheet?.name?.replace(/\s+/g, "_") + ".pdf" ||
      "worksheet.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-slate-50 min-h-screen py-10 md:py-16">

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-10 p-6 md:p-8 rounded-3xl bg-primary/5 border border-primary/10">

          <h1 className="text-2xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
            <Sparkles size={28} />
            {isUrdu
              ? subject?.urdu_name || subject?.name
              : subject?.name}
          </h1>

          <p className="text-slate-600 mt-3">
            {isUrdu
              ? "مشقوں کے ذریعے اپنی سمجھ اور سیکھنے کی صلاحیت کو بہتر بنائیں۔"
              : "Practice worksheets for better understanding and learning."}
          </p>

        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 flex gap-3 overflow-x-auto lg:overflow-y-auto flex-row lg:flex-col p-2">

            {worksheets.length === 0 ? (
              <div className="w-full flex items-center justify-center p-6 text-center">
                <div className="bg-white rounded-xl p-6 shadow text-slate-500 w-full">
                  <p className="font-semibold text-sm">
                    {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
                  </p>
                </div>
              </div>
            ) : (
              worksheets.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => setSelectedWorksheet(ws)}
                  className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer flex-shrink-0 transition
        ${selectedWorksheet?.id === ws.id
                      ? "bg-primary text-white shadow"
                      : "bg-white hover:bg-slate-100"
                    }`}
                >
                  <FileText size={18} />
                  <div>
                    <p className="font-semibold text-sm">
                      {isUrdu ? ws.urdu_name || ws.name : ws.name}
                    </p>
                  </div>
                </div>
              ))
            )}

          </aside>

          {/* PDF VIEWER */}
          <div className="flex-1">

            {worksheets.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-10 text-center text-slate-500">
                {isUrdu ? "مواد جلد دستیاب ہوگا" : "Content will be available soon"}
              </div>
            ) : selectedWorksheet && (
              <div className="bg-white rounded-3xl shadow-lg p-4 md:p-5">

                <h2 className="text-lg md:text-xl font-bold mb-4">
                  {isUrdu
                    ? selectedWorksheet.urdu_name || selectedWorksheet.name
                    : selectedWorksheet.name}
                </h2>

                {/* TOOLBAR */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">

                  <div className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">
                    <ZoomOutButton />
                  </div>

                  <div className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">
                    <ZoomInButton />
                  </div>

                  <div className="bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">
                    <EnterFullScreenButton />
                  </div>

                  {/* ✅ DOWNLOAD BUTTON */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition text-sm font-semibold"
                  >
                    <Download size={16} />
                    {isUrdu ? "ڈاؤن لوڈ" : "Download"}
                  </button>


                </div>

                {/* PDF VIEWER */}
                <Worker workerUrl={workerSrc}>

                  <div style={{ height: "70vh", width: "100%" }}>

                    {pdfBlobUrl ? (
                      <Viewer
                        fileUrl={pdfBlobUrl}
                        plugins={[
                          zoomPluginInstance,
                          fullScreenPluginInstance
                        ]}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        {isUrdu ? "لوڈ ہو رہا ہے..." : "Loading..."}
                      </div>
                    )}

                  </div>

                </Worker>

              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default WorksheetsPage;