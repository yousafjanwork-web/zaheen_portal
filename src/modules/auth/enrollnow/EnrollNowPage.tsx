import { motion } from 'motion/react';
import { CheckCircle, Lightbulb, ShieldCheck } from 'lucide-react';
import image from '@/assets/images/landingPageBanner.png';
import '@/styles/landingpage.css';
import { useEffect } from 'react';
export function EnrollmentLandingPage() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const txid = params.get("txid");
    const afflid = params.get("affid");
    const pubid = params.get("pubid");

    // ✅ Save or update every time page loads
    if (txid) {
      localStorage.setItem("transaction_id", txid);
    }

    if (afflid) {
      localStorage.setItem("afflid", afflid);
    }

    if (pubid) {
      localStorage.setItem("pubid", pubid);
    }
  }, []);

  const handleEnroll = () => {
    const transactionId =
      localStorage.getItem("transaction_id") || Date.now();

    const afflid = localStorage.getItem("afflid") || "";
    const pubid = localStorage.getItem("pubid") || "";

    window.location.href =
      `http://he.zaheen.com.pk/he?redirect=https://z.zaheen.com.pk/sub_enrollnow` +
      `&transaction_id=${transactionId}` +
      `&affid=${afflid}` +
      `&pubid=${pubid}` +
      `&page_name=enrollnow&service_id=205`;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 min-h-screen flex flex-col items-center justify-center text-center">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-label text-secondary uppercase tracking-[0.2em] font-bold text-xs md:text-sm mb-4 md:mb-6"
      >
        Expert Academic Coaching
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-headline text-3xl sm:text-4xl md:text-7xl font-extrabold text-on-surface tracking-tight mb-6 md:mb-8 max-w-4xl leading-[1.2] md:leading-[1.1]"
      >
        Achieve Academic Excellence with <span className="text-primary italic">Zaheen</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-body text-base md:text-xl text-on-surface-variant max-w-2xl mb-10 md:mb-12 leading-relaxed px-2"
      >
        Everything you need to study smarter and succeed.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden mb-10 md:mb-16 shadow-2xl bg-white/50 border border-white"
      >
        <img
          alt="Zaheen Learning Dashboard"
          className="w-full h-auto object-cover block"
          src={image}
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-4 md:gap-6 w-full px-4"
      >
        <button
          onClick={handleEnroll}
          className="group relative w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-full btn-gradient text-on-primary text-lg md:text-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl overflow-hidden"
        >
          <span className="relative z-10">Enroll Now</span>
          <div className="absolute inset-0 bg-black/10 transition-opacity opacity-0 group-hover:opacity-100 duration-300" />
        </button>

        <div className="flex items-center gap-2 text-on-surface-variant font-medium text-sm md:text-base">
          <ShieldCheck className="text-secondary" size={20} />
          <span>Only For Rs. 5+Tax / Week</span>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-body text-base md:text-xl text-on-surface-variant max-w-2xl mb-10 md:mb-12 leading-relaxed px-2"
        >
          <b>Terms and Conditions</b><br></br>
          This is a mobile content subscription service. <br></br>This service is applicable for Zong
          users only on those mobile phones which support GPRS settings.<br></br>
          User will subscribe to Zaheen for 5 + tax PKR/week.<br></br>
          User will be given a free subscription for one day, after which the user will be charged on the next day as per the subscription fee.
          Users will be able to access educational content, quizzes, and learning materials available on Zaheen at any time!
          To unsubscribe from Zaheen,<br></br> <a href="https://z.zaheen.com.pk" style={{ color: 'blue' }}>Click Here</a><br></br>
          or to unsubscribe from Zaheen, send Unsub to 7323
          <br></br>For help, send an email to support@zaheen.com.pk<br></br>
          For Complaints Please Call: 03 111 444 974      </motion.p>

      </motion.div>
    </section>
  );
}