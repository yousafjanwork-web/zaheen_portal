import React from 'react';

export const CTASection = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 text-white flex flex-col lg:flex-row items-center justify-between shadow-2xl shadow-primary/20 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10 text-center lg:text-left mb-8 lg:mb-0">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your life?</h3>
          <p className="text-blue-100 text-lg max-w-xl">
            Join Zaheen today and get 20% off your first month with code: <span className="font-mono font-bold bg-white/20 px-2 py-1 rounded">ZAHEEN20</span>
          </p>
        </div>
        
        <button className="relative z-10 bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-lg whitespace-nowrap">
          Start Your Free Trial
        </button>
      </div>
    </section>
  );
};
export default CTASection;