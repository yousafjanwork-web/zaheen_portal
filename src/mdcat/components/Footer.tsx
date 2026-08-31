import { Stethoscope } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
     <footer className="mt-0 border-t border-brand-100 bg-white/50 py-5 text-center text-slate-400 text-[10px] space-y-1">
        <p className="font-semibold text-slate-500 flex items-center justify-center gap-1">
          <Stethoscope className="w-3.5 h-3.5 text-brand-500" /> zaheen MDCAT
          Prep — Pakistan's elite practice and real-time AI Tutoring engine for
          UHS Lahore, KMU & Sindh entry.
        </p>
        <p className="font-mono-custom text-slate-450 text-[9px]">
          Zaheen AI Advisor continuously diagnoses performance reports to
          optimize your study recommendations.
        </p>
      </footer>
  )
}

export default Footer