"use client";

import React, { useState } from "react";

const faqs = [
  {
    category: "Platform",
    icon: "🎓",
    question: "What is Zaheen Digital and what does it offer?",
    answer:
      "Zaheen Digital is a complete online learning platform Pakistan can rely on, accessible at zaheen.com.pk. It provides a full range of educational resources for students from KG to Class 12, including high-quality video lectures, interactive assessments, structured worksheets, educational games, and past papers — all aligned with the official Pakistani national curriculum. Beyond school-level education, Zaheen Digital also offers professional skills courses such as Web Development and Trading, establishing itself as the best online education platform available to Pakistani students today.",
  },
  {
    category: "Platform",
    icon: "👶",
    question: "How does Zaheen Digital cater to both young kids and college-bound students?",
    answer:
      "Zaheen Digital is a highly versatile ecosystem designed for every stage of a student's learning journey. It delivers top-tier online education Pakistan KG to 12 by utilizing fun, interactive elements for younger kids, and shifting to highly structured, rigorous content for older students. Whether a primary student needs foundational help or a pre-medical student requires focused online FSc preparation, the platform adapts to meet those exact academic demands. Furthermore, it even provides skill-based courses for adults, proving that anyone can benefit from zaheen.com.pk.",
  },
  {
    category: "Curriculum",
    icon: "📚",
    question: "Does the content on Zaheen Digital match what is being taught in physical schools?",
    answer:
      "Yes, it matches perfectly. Every single video lecture, quiz, and worksheet across all core subjects (Mathematics, Sciences, English, Urdu, etc.) is meticulously built around the official national guidelines. By offering authentic Pakistan curriculum online classes, students never have to worry about studying out-of-syllabus material. Ultimately, Zaheen Digital functions as a complete digital learning platform that mirrors — and greatly enhances — the traditional schooling experience directly from your screen.",
  },
  {
    category: "Content",
    icon: "🎬",
    question: "Does Zaheen Digital provide video lectures for students?",
    answer:
      "Yes — high-quality online video lectures are at the heart of Zaheen Digital's learning experience. The platform features well-structured video lessons delivered by experienced teachers, covering every subject and topic from KG to Class 12. These online video lectures are designed for students across Pakistan who want to learn at their own pace, from home, without depending on physical tuition centers. Whether you need conceptual clarity in Biology for MDCAT or a walkthrough of a math chapter for your board exam, Zaheen Digital's resources are extremely reliable.",
  },
  {
    category: "Exam Prep",
    icon: "📝",
    question: "Are past papers available on Zaheen Digital for board and MDCAT preparation?",
    answer:
      "Yes — Zaheen Digital offers a vast collection of online past papers as part of its learning resources, recognizing that past paper practice is one of the most effective exam preparation strategies for students in Pakistan. Practicing online past papers helps students understand recurring question patterns, estimate difficulty levels, and manage their time within exam limits. Whether you are preparing for board exams or MDCAT 2026, the past papers combined with video lectures and guided assessments give you a complete, structured practice system.",
  },
  {
    category: "Content",
    icon: "📄",
    question: "What kind of worksheets does Zaheen Digital offer?",
    answer:
      "Zaheen Digital provides structured, curriculum-aligned online worksheets for students across all grade levels — from KG to Class 12. These worksheets serve as targeted topic-wise practice tools that reinforce what is learned through video lectures. Each worksheet is designed to test understanding, build problem-solving skills, and identify areas that need revision. For students preparing for board exams or MDCAT, regularly completing worksheets is an effective way to consolidate learning and track progress.",
  },
  {
    category: "Exam Prep",
    icon: "✅",
    question: "Does Zaheen Digital have online assessments and tests?",
    answer:
      "Yes — Zaheen Digital features a built-in testing system that provides robust online assessments for students. Once a topic or chapter is studied, these assessments simulate real exam conditions, help students practice time management, identify weak areas, and measure their preparation level. For MDCAT aspirants, taking frequent online assessments is critical to building the speed and accuracy needed on exam day. Zaheen Digital makes this self-testing process seamless and accessible from any device, anywhere in Pakistan.",
  },
  {
    category: "Platform",
    icon: "🎮",
    question: "Does Zaheen Digital use educational games for learning?",
    answer:
      "Yes — Zaheen Digital incorporates engaging educational games as part of its learning methodology, especially for younger students from KG to middle school. Educational games make the learning process interactive and fun, which improves knowledge retention far more effectively than passive reading. Research consistently shows that game-based learning increases student motivation and academic performance. By combining games with video lectures, worksheets, and assessments, Zaheen Digital creates a rich, multi-format learning environment.",
  },
  {
    category: "Courses",
    icon: "💼",
    question: "What professional courses does Zaheen Digital offer?",
    answer:
      "Zaheen Digital goes beyond school and college subjects by offering professional skills courses for students and adults looking to build career-ready capabilities. Currently, Zaheen Digital offers a comprehensive web development course — covering essential skills for building websites and digital products — as well as an online trading course covering financial markets, investment strategies, and market analysis. These professional courses are practically designed to give learners real, applicable skills for Pakistan's growing digital economy.",
  },
  {
    category: "Curriculum",
    icon: "🇵🇰",
    question: "Is Zaheen Digital aligned with Pakistan's national curriculum?",
    answer:
      "Yes — all academic content on Zaheen Digital is carefully aligned with the official Pakistani national curriculum. This includes the 2025 Uniform National Curriculum (UNC) for school-level classes and the PMDC-approved syllabus for MDCAT-track F.Sc students. This curriculum alignment ensures that students using Zaheen Digital are not studying irrelevant or off-track material — everything they learn directly supports their board exam and MDCAT preparation.",
  },
  {
    category: "Access",
    icon: "📱",
    question: "Can I access Zaheen Digital on mobile or do I need a computer?",
    answer:
      "Zaheen Digital is accessible on all modern devices — mobile phones, tablets, laptops, and desktop computers. This mobile-friendly design is especially important for students across Pakistan, where smartphones are often the primary device for internet access. There is no need to be in a fixed location — students can watch video lectures, complete worksheets, take assessments, and play educational games from anywhere, at any time.",
  },
  {
    category: "Pricing",
    icon: "💰",
    question: "Is Zaheen Digital free to use, or is there a subscription fee?",
    answer:
      "Zaheen Digital offers some initial video lectures for free so that students can experience the platform's teaching quality. However, to unlock the complete courses, students must purchase a highly affordable premium subscription. The subscription packages are designed to be accessible to all students across Pakistan: Daily for Rs. 5 + Tax, Weekly for Rs. 15 + Tax, and Monthly for Rs. 50 + Tax. This minimal pricing structure ensures that every student can afford world-class education and complete exam preparation without financial strain.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FA", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0F1B2D 0%, #1A3152 60%, #0F1B2D 100%)",
        padding: "72px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 320, height: 320, borderRadius: "50%",
          background: "rgba(59,130,246,0.08)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: "50%",
          background: "rgba(245,166,35,0.07)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)",
            borderRadius: 24, padding: "6px 16px", marginBottom: 28,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6" }} />
            <span style={{ color: "#93C5FD", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
              Help Center
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800,
            color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 20px",
          }}>
            Frequently Asked Questions
          </h1>

          <p style={{ color: "#94A3B8", fontSize: 17, lineHeight: 1.7, maxWidth: 620, margin: "0 0 36px" }}>
            Find answers to the most common questions about Zaheen Digital — Pakistan's online learning platform for students from KG to Class 12, plus professional skills courses.
          </p>

          {/* Stats pills */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
            {[
              { icon: "❓", label: `${faqs.length} Questions Answered` },
              { icon: "🎓", label: "KG to Class 12" },
              { icon: "📶", label: "Zong Powered" },
            ].map((pill) => (
              <div key={pill.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20, padding: "8px 16px",
              }}>
                <span style={{ fontSize: 14 }}>{pill.icon}</span>
                <span style={{ color: "#CBD5E1", fontSize: 13, fontWeight: 500 }}>{pill.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── PRICING HIGHLIGHT CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
          borderRadius: 20, padding: "36px 40px", marginBottom: 40,
          boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 200, height: 200, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />
          <p style={{ color: "#BFDBFE", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>
            Subscription Plans
          </p>
          <h3 style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            Affordable for Every Student in Pakistan
          </h3>
          <p style={{ color: "#BFDBFE", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Start for free, then unlock full access with any of our flexible plans — priced to ensure no student is left behind.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 12 }}>
            {[
              { label: "Daily — Rs. 5 + Tax",   icon: "☀️" },
              { label: "Weekly — Rs. 15 + Tax",  icon: "📆" },
              { label: "Monthly — Rs. 50 + Tax", icon: "🗓️" },
            ].map((plan) => (
              <div key={plan.label} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.12)", borderRadius: 12,
                padding: "12px 20px", border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <span style={{ fontSize: 18 }}>{plan.icon}</span>
                <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 600 }}>{plan.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ACCORDION ── */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: isOpen
                    ? "0 4px 24px rgba(15,27,45,0.12)"
                    : "0 1px 6px rgba(15,27,45,0.06)",
                  border: isOpen ? "1px solid #DBEAFE" : "1px solid #E9EEF6",
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  onClick={() => toggle(index)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 20,
                    padding: "22px 32px", textAlign: "left" as const,
                  }}
                >
                  {/* Icon badge */}
                  <span style={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: 12,
                    background: isOpen ? "#EFF6FF" : "#F8FAFC",
                    border: isOpen ? "2px solid #BFDBFE" : "2px solid #E2E8F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, transition: "all 0.2s",
                  }}>
                    {faq.icon}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      display: "block",
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
                      textTransform: "uppercase" as const,
                      color: isOpen ? "#2563EB" : "#94A3B8",
                      marginBottom: 4,
                    }}>
                      {faq.category}
                    </span>
                    <span style={{
                      fontSize: 15, fontWeight: 650,
                      color: isOpen ? "#1E3A5F" : "#1E293B",
                      lineHeight: 1.4,
                    }}>
                      {faq.question}
                    </span>
                  </div>

                  {/* Chevron */}
                  <span style={{
                    flexShrink: 0, fontSize: 22, color: isOpen ? "#2563EB" : "#94A3B8",
                    display: "inline-block",
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    lineHeight: 1,
                  }}>
                    ›
                  </span>
                </button>

                {isOpen && (
                  <div style={{
                    padding: "20px 32px 28px 96px",
                    borderTop: "1px solid #EFF6FF",
                  }}>
                    <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CONTACT CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, #0F1B2D, #1A3152)",
          borderRadius: 20, padding: "40px",
          marginTop: 40,
          display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center",
          boxShadow: "0 8px 32px rgba(15,27,45,0.2)",
        }}>
          <div>
            <p style={{ color: "#F5A623", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>
              Still need help?
            </p>
            <h3 style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              Contact Our Team
            </h3>
            <p style={{ color: "#94A3B8", fontSize: 15, marginBottom: 6 }}>
              info@zaheen.com.pk
            </p>
            <p style={{ color: "#94A3B8", fontSize: 15 }}>
              zaheen.com.pk
            </p>
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(245,166,35,0.15)",
            border: "2px solid rgba(245,166,35,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, flexShrink: 0,
          }}>
            ✉️
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;