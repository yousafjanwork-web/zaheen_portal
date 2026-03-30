import React from "react";

const cards = [
  {
    title: "KG to Grade 12",
    desc: "Complete school learning with videos, quizzes and tests.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Professional Skills",
    desc: "Digital Marketing, Web Development and Trading courses.",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "AI Tutor",
    desc: "Ask questions and learn instantly with AI assistance.",
    color: "from-green-500 to-emerald-600"
  },
  {
    title: "Unlimited Learning",
    desc: "Access all courses with one subscription.",
    color: "from-orange-400 to-red-500"
  },
  {
    title: "Affordable Plan",
    desc: "Start learning today with only Rs 5 / Day.",
    color: "from-cyan-500 to-blue-600"
  }
];

const PromoSlider = () => {

  return (

    <section className="py-6 px-4 bg-white">

      <h2 className="text-xl font-bold text-slate-900 mb-4">
        Explore Learning
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">

        {cards.map((card, i) => (

          <div
            key={i}
            className={`
              min-w-[220px]
              rounded-2xl
              p-6
              text-white
              shadow-lg
              bg-gradient-to-r ${card.color}
            `}
          >
            <a href="/grade-view/kg">
              <h3 className="text-lg font-bold mb-2">
                {card.title}
              </h3></a>

            <p className="text-sm opacity-90">
              {card.desc}
            </p>

          </div>

        ))}

      </div>

    </section>

  );

};

export default PromoSlider;