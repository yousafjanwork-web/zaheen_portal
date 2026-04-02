import React from "react";

const WelcomeCard = ({ isUrdu, title }: any) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/10">
      
      <div className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900">
          {isUrdu ? title.ur : title.en}
        </h1>

        <p className="text-lg text-slate-600 mt-2 max-w-2xl">
          {isUrdu
            ? "انگریزی اور اردو میں سیکھنا شروع کرنے کے لیے اپنے گریڈ کا انتخاب کریں۔"
            : "Select your grade to start learning."}
        </p>
      </div>

      <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition">
        {isUrdu ? "تمام کورسز دیکھیں" : "Explore All Courses"}
      </button>
    </div>
  );
};

export default WelcomeCard;