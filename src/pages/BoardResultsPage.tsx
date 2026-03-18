import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Globe, Menu } from "lucide-react";
import { getLanguage } from "@/i18n";

/* ================= DATA ================= */

const regionData = [
  {
    region: "Federal",
    urdu_region: "وفاقی",
    boards: [
      {
        name: "Federal Board (FBISE), Islamabad",
        urdu_name: "فیڈرل بورڈ (ایف بی آئی ایس ای)، اسلام آباد",
        url: "https://portal.fbise.edu.pk/fbise-conduct/result/",
      },
    ],
  },
  {
    region: "Punjab",
    urdu_region: "پنجاب",
    boards: [
      { name: "BISE Lahore", urdu_name: "لاہور بورڈ", url: "https://result.biselahore.com/" },
      { name: "BISE Gujranwala", urdu_name: "گوجرانوالہ بورڈ", url: "https://www.bisegrw.edu.pk/prev-years-result.html" },
      { name: "BISE Faisalabad", urdu_name: "فیصل آباد بورڈ", url: "https://result.bisefsd.edu.pk/" },
      { name: "BISE Multan", urdu_name: "ملتان بورڈ", url: "https://results.bisemultan.edu.pk/" },
      { name: "BISE Rawalpindi", urdu_name: "راولپنڈی بورڈ", url: "https://results.biserawalpindi.edu.pk/" },
      { name: "BISE Sargodha", urdu_name: "سرگودھا بورڈ", url: "https://bisesargodha.edu.pk/content/BoardResult.aspx" },
      { name: "BISE Bahawalpur", urdu_name: "بہاولپور بورڈ", url: "https://results.bisebwp.pk/indexSSC_PII.aspx" },
      { name: "BISE Dera Ghazi Khan", urdu_name: "ڈی جی خان بورڈ", url: "https://bisedgkhan.edu.pk/RESULLLT_MSS000_2024/index.php" },
      { name: "BISE Sahiwal", urdu_name: "ساہیوال بورڈ", url: "https://www.bisesahiwal.edu.pk/allresult/" },
    ],
  },
  {
    region: "Sindh",
    urdu_region: "سندھ",
    boards: [
      { name: "BISE Karachi (Intermediate)", urdu_name: "کراچی بورڈ (انٹر)", url: "https://www.biek.com.pk/online-result/" },
      { name: "BISE Karachi (Secondary)", urdu_name: "کراچی بورڈ (میٹرک)", url: "https://www.bsek.com.pk/online-result/" },
      { name: "BISE Hyderabad", urdu_name: "حیدرآباد بورڈ", url: "https://www.biseh.edu.pk/examination-results.html" },
      { name: "BISE Sukkur", urdu_name: "سکھر بورڈ", url: "http://bisesukkur.org.pk/results/?i=1" },
      { name: "BISE Larkana", urdu_name: "لاڑکانہ بورڈ", url: "https://www.biselrk.edu.pk/ResultsSSC.aspx" },
      { name: "Aga Khan Board", urdu_name: "آغا خان بورڈ", url: "https://examinationboard.aku.edu/services/Pages/online-results.aspx" },
    ],
  },
  {
    region: "Khyber Pakhtunkhwa",
    urdu_region: "خیبر پختونخوا",
    boards: [
      { name: "BISE Peshawar", urdu_name: "پشاور بورڈ", url: "https://cloud.bisep.edu.pk/" },
      { name: "BISE Abbottabad", urdu_name: "ایبٹ آباد بورڈ", url: "https://www.biseatd.edu.pk/all_results.php" },
      { name: "BISE Mardan", urdu_name: "مردان بورڈ", url: "https://result.bisemdn.edu.pk/" },
      { name: "BISE Swat", urdu_name: "سوات بورڈ", url: "https://www.bisess.edu.pk/site/home/results-section" },
      { name: "BISE Kohat", urdu_name: "کوہاٹ بورڈ", url: "https://www.bisekt.edu.pk/results" },
      { name: "BISE Bannu", urdu_name: "بنوں بورڈ", url: "https://www.biseb.edu.pk/results.php" },
      { name: "BISE Malakand", urdu_name: "ملاکنڈ بورڈ", url: "https://www.bisemalakand.edu.pk/result" },
      { name: "BISE D.I Khan", urdu_name: "ڈی آئی خان بورڈ", url: "https://www.bisedik.edu.pk/results" },
    ],
  },
  {
    region: "Balochistan",
    urdu_region: "بلوچستان",
    boards: [
      { name: "BISE Quetta", urdu_name: "کوئٹہ بورڈ", url: "https://result.bbiseqta.edu.pk/" },
    ],
  },
  {
    region: "AJK",
    urdu_region: "آزاد کشمیر",
    boards: [
      { name: "BISE Mirpur", urdu_name: "میرپور بورڈ", url: "https://ajkbise.net/results.php" },
    ],
  },
];

/* ================= COMPONENT ================= */

const BoardResultsPage = () => {
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [selectedBoard, setSelectedBoard] = useState(regionData[0].boards[0]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  useEffect(() => {
    document.dir = isUrdu ? "rtl" : "ltr";
  }, [isUrdu]);

  const toggleRegion = (region: string) => {
    setOpenRegion(openRegion === region ? null : region);
  };

  return (
    <section className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-12 p-8 rounded-3xl bg-primary/5 border">
          <h1 className="text-4xl font-black flex items-center gap-3">
            <Globe size={32} />
            {isUrdu ? "پاکستان بورڈ نتائج" : "Pakistan Board Results"}
          </h1>

          <p className="mt-3 text-slate-600">
            {isUrdu
              ? "پاکستان کے تمام تعلیمی بورڈز کے سرکاری نتائج دیکھیں۔"
              : "Access official result portals for all educational boards in Pakistan."}
          </p>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="w-full flex justify-between bg-white border rounded-xl px-4 py-3"
          >
            <span className="flex gap-2 items-center">
              <Menu size={18} />
              {isUrdu ? "بورڈ منتخب کریں" : "Select Board"}
            </span>
            <ChevronDown size={18} />
          </button>

          {mobileMenu && (
            <div className="mt-3 bg-white rounded-xl shadow max-h-[350px] overflow-y-auto">

              {regionData.map((region) => (
                <div key={region.region}>
                  <button
                    onClick={() => toggleRegion(region.region)}
                    className="w-full flex justify-between p-3 font-semibold border-b"
                  >
                    {isUrdu ? region.urdu_region : region.region}

                    {openRegion === region.region ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {openRegion === region.region &&
                    region.boards.map((board) => (
                      <button
                        key={board.name}
                        onClick={() => {
                          setSelectedBoard(board);
                          setMobileMenu(false);
                        }}
                        className="w-full text-left px-5 py-2 hover:bg-slate-100"
                      >
                        {isUrdu
                          ? board.urdu_name || board.name
                          : board.name}
                      </button>
                    ))}
                </div>
              ))}

            </div>
          )}
        </div>

        {/* DESKTOP */}
        <div className="flex gap-10">

          <aside className="hidden lg:flex w-72 flex-col gap-2">
            {regionData.map((region) => (
              <div key={region.region} className="bg-white rounded-xl shadow">

                <button
                  onClick={() => toggleRegion(region.region)}
                  className="w-full flex justify-between p-3 font-semibold"
                >
                  {isUrdu ? region.urdu_region : region.region}

                  {openRegion === region.region ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {openRegion === region.region &&
                  region.boards.map((board) => (
                    <button
                      key={board.name}
                      onClick={() => setSelectedBoard(board)}
                      className={`text-left px-4 py-2 hover:bg-slate-100
                      ${
                        selectedBoard?.name === board.name
                          ? "bg-primary/10 font-semibold"
                          : ""
                      }`}
                    >
                      {isUrdu
                        ? board.urdu_name || board.name
                        : board.name}
                    </button>
                  ))}
              </div>
            ))}
          </aside>

          {/* VIEWER */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow overflow-hidden">

              <div className="p-4 border-b font-semibold">
                {isUrdu
                  ? selectedBoard.urdu_name || selectedBoard.name
                  : selectedBoard.name}
              </div>

              <iframe
                src={selectedBoard.url}
                title="Board Result"
                className="w-full h-[750px]"
              />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default BoardResultsPage;