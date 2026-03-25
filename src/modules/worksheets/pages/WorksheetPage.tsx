import React, { useEffect, useState } from "react";
import { Sparkles, FileText } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";

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

  const [worksheets, setWorksheets] = useState([]);
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);

  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();

  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;
  const { EnterFullScreenButton } = fullScreenPluginInstance;

  useEffect(() => {

    const fetchWorksheets = async () => {

      try {

        const res = await fetch(
          `https://api.zaheen.com.pk/api/chapter/${subjectId}/worksheets`
        );

        const data = await res.json();

        setWorksheets(data);
        setSelectedWorksheet(data[0]);

      } catch (err) {
        console.error("Worksheet API error", err);
      }

    };

    fetchWorksheets();

  }, [subjectId]);

  const pdfUrl = selectedWorksheet
    ? `https://api.zaheen.com.pk/api/getpdf/${selectedWorksheet.id}`
    : null;

  return (
    <section className="bg-slate-50 min-h-screen py-16">

      <div className="max-w-7xl mx-auto px-4">

        {/* WELCOME */}

        <div className="mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/10">

          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Sparkles size={32} />
            {subject?.name} | {subject?.urdu_name}
          </h1>

          <p className="text-slate-600 mt-2">
            Practice worksheets for better understanding and learning.
          </p>

          <p className="text-sm text-slate-500">
            مختلف مشقیں حل کریں اور اپنی مہارت کو بہتر بنائیں۔
          </p>

        </div>

        {/* MAIN LAYOUT */}

        <div className="flex flex-col lg:flex-row gap-10">

          {/* SIDEBAR */}

          <aside
            className="
            w-full lg:w-72
            flex gap-3
            overflow-x-auto lg:overflow-y-auto
            flex-row lg:flex-col
            p-2
            scrollbar-thin scrollbar-thumb-primary/40
          "
          >

            {worksheets.map((ws) => (

              <div
                key={ws.id}
                onClick={() => setSelectedWorksheet(ws)}
                className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer flex-shrink-0
                ${selectedWorksheet?.id === ws.id
                    ? "bg-primary text-white"
                    : "bg-white hover:bg-slate-100"
                  }`}
              >

                <FileText size={18} />

                <div>
                  <p className="font-semibold text-sm">{ws.name}</p>
                  <p className="text-xs opacity-70">{ws.urdu_name}</p>
                </div>

              </div>

            ))}

          </aside>

          {/* PDF VIEWER */}

          <div className="flex-1">

            {selectedWorksheet && (

              <div className="bg-white rounded-3xl shadow-lg p-4">

                <h2 className="text-xl font-bold mb-4">
                  {selectedWorksheet.name}
                </h2>

                {/* TOOLBAR */}

                <div className="flex items-center gap-3 mb-4">

                  <div className="bg-slate-100 p-2 rounded-lg">
                    <ZoomOutButton />
                  </div>

                  <div className="bg-slate-100 p-2 rounded-lg">
                    <ZoomInButton />
                  </div>

                  <div className="bg-slate-100 p-2 rounded-lg">
                    <EnterFullScreenButton />
                  </div>

                </div>

                {/* PDF VIEWER */}

                <Worker workerUrl={workerSrc}>

                  <div style={{ height: "750px", width: "100%" }}>

                    <Viewer
                      fileUrl={pdfUrl}
                      plugins={[
                        zoomPluginInstance,
                        fullScreenPluginInstance
                      ]}
                      renderError={() => (

                        <div className="p-6 rounded-2xl bg-yellow-100 border-dashed border-2 border-yellow-400 text-yellow-800 text-center font-semibold min-w-[180px]">

                          🎬 Coming Soon! <br />
                          Lectures will be added shortly.

                        </div>

                      )}
                    />

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