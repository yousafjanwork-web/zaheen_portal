import React, { useState } from "react";
import { ChevronDown, ChevronRight, Globe, Menu } from "lucide-react";
const regionData = [
  {
    region: "Federal",
    boards: [
      {
        name: "Federal Board (FBISE), Islamabad",
        url: "https://portal.fbise.edu.pk/fbise-conduct/result/",
      },
    ],
  },
  {
    region: "Punjab",
    boards: [
      { name: "BISE Lahore", url: "https://result.biselahore.com/" },
      { name: "BISE Gujranwala", url: "https://www.bisegrw.edu.pk/prev-years-result.html" },
      { name: "BISE Faisalabad", url: "https://result.bisefsd.edu.pk/" },
      { name: "BISE Multan", url: "https://results.bisemultan.edu.pk/" },
      { name: "BISE Rawalpindi", url: "https://results.biserawalpindi.edu.pk/" },
      { name: "BISE Sargodha", url: "https://bisesargodha.edu.pk/content/BoardResult.aspx" },
      { name: "BISE Bahawalpur", url: "https://results.bisebwp.pk/indexSSC_PII.aspx" },
      { name: "BISE Dera Ghazi Khan", url: "https://bisedgkhan.edu.pk/RESULLLT_MSS000_2024/index.php" },
      { name: "BISE Sahiwal", url: "https://www.bisesahiwal.edu.pk/allresult/" },
    ],
  },
  {
    region: "Sindh",
    boards: [
      { name: "BISE Karachi (Intermediate)", url: "https://www.biek.com.pk/online-result/" },
      { name: "BISE Karachi (Secondary)", url: "https://www.bsek.com.pk/online-result/" },
      { name: "BISE Hyderabad", url: "https://www.biseh.edu.pk/examination-results.html" },
      { name: "BISE Sukkur", url: "http://bisesukkur.org.pk/results/?i=1" },
      { name: "BISE Larkana", url: "https://www.biselrk.edu.pk/ResultsSSC.aspx" },
      { name: "Aga Khan University Board", url: "https://examinationboard.aku.edu/services/Pages/online-results.aspx" },
    ],
  },
  {
    region: "Khyber Pakhtunkhwa",
    boards: [
      { name: "BISE Peshawar", url: "https://cloud.bisep.edu.pk/" },
      { name: "BISE Abbottabad", url: "https://www.biseatd.edu.pk/all_results.php" },
      { name: "BISE Mardan", url: "https://result.bisemdn.edu.pk/" },
      { name: "BISE Swat", url: "https://www.bisess.edu.pk/site/home/results-section" },
      { name: "BISE Kohat", url: "https://www.bisekt.edu.pk/results" },
      { name: "BISE Bannu", url: "https://www.biseb.edu.pk/results.php" },
      { name: "BISE Malakand", url: "https://www.bisemalakand.edu.pk/result" },
      { name: "BISE Dera Ismail Khan", url: "https://www.bisedik.edu.pk/results" },
    ],
  },
  {
    region: "Balochistan",
    boards: [
      { name: "BISE Quetta", url: "https://result.bbiseqta.edu.pk/" },
    ],
  },
  {
    region: "Azad Jammu & Kashmir",
    boards: [
      { name: "BISE Mirpur (AJK)", url: "https://ajkbise.net/results.php" },
    ],
  },
];
const BoardResultsPage = () => {
  const [openRegion, setOpenRegion] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(regionData[0].boards[0]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleRegion = (region) => {
    setOpenRegion(openRegion === region ? null : region);
  };

  return (
    <section className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Welcome */}

        <div className="mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Globe size={32} />
            Pakistan Board Results
          </h1>

          <p className="text-slate-600 mt-3 max-w-3xl">
            Access official result portals for all educational boards in Pakistan.
          </p>
        </div>


        {/* MOBILE BOARD SELECT */}

        <div className="lg:hidden mb-6">

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="w-full flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm"
          >
            <span className="font-semibold flex items-center gap-2">
              <Menu size={18} />
              Select Board
            </span>

            <ChevronDown size={18} />
          </button>

          {mobileMenu && (

            <div className="mt-3 bg-white rounded-xl shadow-md max-h-[350px] overflow-y-auto">

              {regionData.map((region) => (

                <div key={region.region}>

                  <button
                    onClick={() => toggleRegion(region.region)}
                    className="w-full flex justify-between items-center p-3 font-semibold border-b"
                  >
                    {region.region}

                    {openRegion === region.region ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {openRegion === region.region && (

                    <div>

                      {region.boards.map((board) => (

                        <button
                          key={board.name}
                          onClick={() => {
                            setSelectedBoard(board);
                            setMobileMenu(false);
                          }}
                          className="w-full text-left px-5 py-2 text-sm hover:bg-slate-100"
                        >
                          {board.name}
                        </button>

                      ))}

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>


        {/* Layout */}

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Desktop Sidebar */}

          <aside className="hidden lg:flex w-72 flex-col gap-2">

            {regionData.map((region) => (

              <div key={region.region} className="bg-white rounded-xl shadow-sm">

                <button
                  onClick={() => toggleRegion(region.region)}
                  className="w-full flex justify-between items-center p-3 font-semibold text-left hover:bg-slate-100 rounded-xl"
                >
                  {region.region}

                  {openRegion === region.region ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {openRegion === region.region && (

                  <div className="flex flex-col">

                    {region.boards.map((board) => (

                      <button
                        key={board.name}
                        onClick={() => setSelectedBoard(board)}
                        className={`text-left px-4 py-2 text-sm hover:bg-slate-100
                        ${selectedBoard?.name === board.name
                            ? "bg-primary/10 font-semibold"
                            : ""
                          }`}
                      >
                        {board.name}
                      </button>

                    ))}

                  </div>

                )}

              </div>

            ))}

          </aside>


          {/* Result Viewer */}

          <div className="flex-1">

            {selectedBoard && (

              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                <div className="p-4 border-b font-semibold">
                  {selectedBoard.name}
                </div>

                <iframe
                  title="Board Result"
                  src={selectedBoard.url}
                  className="w-full h-[750px]"
                />

              </div>

            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default BoardResultsPage;