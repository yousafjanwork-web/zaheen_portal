import React from "react";

const cards = [
  {
    title: "KG to Grade 12",
    desc: "Complete school learning with videos, quizzes and tests.",
    color: "from-blue-500 to-indigo-600",
    link: "/grade-view/k-12"
  },
  {
    title: "Professional Skills",
    desc: "Digital Marketing, Web Development and Trading courses.",
    color: "from-purple-500 to-pink-500",
    link: "/skills/300"
  },
  {
    title: "AI Tutor",
    desc: "Ask questions and learn instantly with AI assistance.",
    color: "from-green-500 to-emerald-600",
    link: "ai"
  },
  {
    title: "Unlimited Learning",
    desc: "Access all courses with one subscription.",
    color: "from-orange-400 to-red-500",
    link: "/grade-view/k-12"
  },
  {
    title: "Affordable Plan",
    desc: "Start learning today with only Rs 5 / Day.",
    color: "from-cyan-500 to-blue-600",
    link: "pricing" // 👈 scroll target
  }
];

const PromoSlider = () => {

  const handleClick = (e, link) => {
    if (link === "pricing") {
      e.preventDefault();

      const el = document.getElementById("pricing");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-6 px-4 bg-white">

      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Explore Learning
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">

        {cards.map((card, i) => (
          <a
            key={i}
            href={card.link || "#"}
            onClick={(e) => handleClick(e, card.link)}
          >
            <div
              className={`
                  min-w-[220px]
                  h-[160px]
                  rounded-2xl
                  p-6
                  text-white
                  shadow-lg
                  bg-gradient-to-r ${card.color}
                  flex flex-col
                `}
            >
              <h3 className="text-lg font-bold mb-2">
                {card.title}
              </h3>

              <div className="flex-1 overflow-hidden">
                <p className="text-sm opacity-90">
                  {card.desc}
                </p>
              </div>
            </div>
          </a>
        ))}

      </div>

    </section>
  );
};

export default PromoSlider;