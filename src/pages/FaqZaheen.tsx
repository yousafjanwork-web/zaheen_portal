"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Zaheen Digital and what does it offer?",
    answer:
      "Zaheen Digital is a complete online learning platform Pakistan can rely on, accessible at zaheen.com.pk. It provides a full range of educational resources for students from KG to Class 12, including high-quality video lectures, interactive assessments, structured worksheets, educational games, and past papers — all aligned with the official Pakistani national curriculum. Beyond school-level education, Zaheen Digital also offers professional skills courses such as Web Development and Trading, establishing itself as the best online education platform available to Pakistani students today.",
  },
  {
    question: "How does Zaheen Digital cater to both young kids and college-bound students?",
    answer:
      "Zaheen Digital is a highly versatile ecosystem designed for every stage of a student's learning journey. It delivers top-tier online education Pakistan KG to 12 by utilizing fun, interactive elements for younger kids, and shifting to highly structured, rigorous content for older students. Whether a primary student needs foundational help or a pre-medical student requires focused online FSc preparation, the platform adapts to meet those exact academic demands. Furthermore, it even provides skill-based courses for adults, proving that anyone can benefit from zaheen.com.pk.",
  },
  {
    question: "Does the content on Zaheen Digital match what is being taught in physical schools?",
    answer:
      "Yes, it matches perfectly. Every single video lecture, quiz, and worksheet across all core subjects (Mathematics, Sciences, English, Urdu, etc.) is meticulously built around the official national guidelines. By offering authentic Pakistan curriculum online classes, students never have to worry about studying out-of-syllabus material. Ultimately, Zaheen Digital functions as a complete digital learning platform at zaheen.com.pk that mirrors—and greatly enhances—the traditional schooling experience directly from your screen.",
  },
  {
    question: "Does Zaheen Digital provide video lectures for students?",
    answer:
      "Yes — high-quality online video lectures are at the heart of Zaheen Digital's learning experience. The platform features well-structured video lessons delivered by experienced teachers, covering every subject and topic from KG to Class 12. These online video lectures are designed for students across Pakistan who want to learn at their own pace, from home, without depending on physical tuition centers. Whether you need conceptual clarity in Biology for MDCAT or a walkthrough of a math chapter for your board exam, Zaheen Digital's resources at zaheen.com.pk are extremely reliable.",
  },
  {
    question: "Are past papers available on Zaheen Digital for board and MDCAT preparation?",
    answer:
      "Yes — Zaheen Digital offers a vast collection of online past papers as part of its learning resources, recognizing that past paper practice is one of the most effective exam preparation strategies for students in Pakistan. Practicing online past papers helps students understand recurring question patterns, estimate difficulty levels, and manage their time within exam limits. Whether you are preparing for board exams or MDCAT 2026, the past papers available on Zaheen Digital at zaheen.com.pk — combined with video lectures and guided assessments — give you a complete, structured practice system.",
  },
  {
    question: "What kind of worksheets does Zaheen Digital offer?",
    answer:
      "Zaheen Digital provides structured, curriculum-aligned online worksheets for students across all grade levels — from KG to Class 12. These online worksheets for students serve as targeted topic-wise practice tools that reinforce what is learned through video lectures. Each worksheet is designed to test understanding, build problem-solving skills, and identify areas that need revision. For students preparing for board exams or MDCAT online preparation in Pakistan, regularly completing worksheets on zaheen.com.pk is an effective way to consolidate learning and track progress.",
  },
  {
    question: "Does Zaheen Digital have online assessments and tests?",
    answer:
      "Yes — Zaheen Digital features a built-in testing system that provides robust online assessments for students. Once a topic or chapter is studied, these online assessments for students are structured to simulate real exam conditions, help them practice time management, identify weak areas, and measure their preparation level. For MDCAT aspirants, taking frequent online assessments is critical to building the speed and accuracy needed on exam day. Zaheen Digital makes this self-testing process seamless and accessible from any device, anywhere in Pakistan.",
  },
  {
    question: "Does Zaheen Digital use educational games for learning?",
    answer:
      "Yes — Zaheen Digital incorporates engaging educational games for kids as part of its learning methodology, especially for younger students from KG to middle school. Educational games for kids make the learning process interactive and fun, which improves knowledge retention far more effectively than passive reading. Research consistently shows that game-based learning increases student motivation and academic performance. By combining games with video lectures, worksheets, and assessments, Zaheen Digital creates a rich, multi-format learning environment that keeps students excited to learn every day.",
  },
  {
    question: "What professional courses does Zaheen Digital offer?",
    answer:
      "Zaheen Digital goes beyond school and college subjects by offering professional skills courses for students and adults looking to build career-ready capabilities. Currently, Zaheen Digital offers a comprehensive web development course online — covering essential skills for building websites and digital products — as well as an online trading course — covering financial markets, investment strategies, and market analysis. These professional courses are practically designed to give learners real, applicable skills for Pakistan's growing digital economy. Explore all available courses at Zaheen Digital and take the first step toward upskilling for the future.",
  },
  {
    question: "Is Zaheen Digital aligned with Pakistan's national curriculum?",
    answer:
      "Yes — all academic content on Zaheen Digital is carefully aligned with the official Pakistani national curriculum. This includes the 2025 Uniform National Curriculum (UNC) for school-level classes and the PMDC-approved syllabus for MDCAT-track F.Sc students. This curriculum alignment ensures that students using Zaheen Digital are not studying irrelevant or off-track material — everything they learn at Zaheen Digital directly supports their board exam and MDCAT preparation. Parents and students can trust Zaheen Digital as a reliable digital supplement to formal schooling in Pakistan.",
  },
  {
    question: "Can I access Zaheen Digital on mobile or do I need a computer?",
    answer:
      "Zaheen Digital is accessible on all modern devices — mobile phones, tablets, laptops, and desktop computers. This mobile-friendly design is especially important for students across Pakistan, where smartphones are often the primary device for internet access. There is no need to be in a fixed location — students can watch video lectures, complete worksheets, take assessments, and play educational games from anywhere, at any time.",
  },
  {
    question: "Is Zaheen Digital free to use, or is there a subscription fee?",
    answer:
      "Zaheen Digital offers some initial video lectures for free so that students can experience the platform's teaching quality. However, to unlock and view the complete courses, students must purchase a highly affordable premium subscription. The subscription packages are designed to be accessible to all students across Pakistan: Daily for Rs. 5 + Tax, Weekly for Rs. 15 + Tax, and Monthly for Rs. 50 + Tax. This minimal pricing structure ensures that every student can afford world-class education and complete exam preparation without financial strain.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          Frequently Asked Questions
        </h1>

        <p className="mb-10 text-slate-600">
          Find answers to the most common questions about Zaheen Digital — Pakistan&apos;s online learning platform for students from KG to Class 12, plus professional skills courses.
        </p>

        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-lg font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <p className="pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="text-2xl font-semibold mt-14 mb-4">
          Still need help?
        </h2>

        <p className="mb-2 text-slate-600">
          If you couldn&apos;t find the answer you were looking for, reach out to our team directly.
        </p>

        <p className="font-semibold">
          info@zaheen.com.pk
        </p>

      </div>
    </div>
  );
};

export default FAQ;