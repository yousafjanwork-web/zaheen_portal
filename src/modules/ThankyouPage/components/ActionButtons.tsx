import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function ActionButtons() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center mb-24"
      >
        <a
          href="/"
          className="inline-flex items-center justify-center px-10 py-5 bg-signature-gradient text-on-primary rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-300"
        >
          Go to My Dashboard
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
        <a
          href="/grade-view/k-12"
          className="inline-flex items-center justify-center px-10 py-5 bg-secondary-fixed text-on-secondary-fixed rounded-full font-bold text-lg hover:bg-secondary-container transition-colors duration-300"
        >
          Explore Courses
        </a>
      </motion.div>

    </>
  );
}