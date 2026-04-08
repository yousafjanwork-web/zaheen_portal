import { motion } from "motion/react";

export default function TermsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10 max-w-3xl mx-auto text-center px-4"
    >
      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
        <b>Terms and Conditions</b><br />
        This is a mobile content subscription service.<br />
        This service is applicable for Zong users only on those mobile phones which support GPRS settings.<br />
        User will subscribe to Zaheen for 5 + tax PKR/week.<br />
        User will be given a free subscription for one day, after which the user will be charged on the next day as per the subscription fee.<br />
        Users will be able to access educational content, quizzes, and learning materials available on Zaheen at any time!<br />

        To unsubscribe from Zaheen,<br />
        <a href="https://z.zaheen.com.pk" className="text-blue-600 underline">
          Click Here
        </a><br />

        or send <b>Unsub</b> to <b>7323</b><br />
        For help, email <b>support@zaheen.com.pk</b><br />
        For complaints call: <b>03 111 444 974</b>
      </p>
    </motion.div>
  );
}