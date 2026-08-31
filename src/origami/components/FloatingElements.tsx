const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Paper Airplane */}
      <div className="animate-fly-across absolute top-[15%]" style={{ animationDuration: '25s', animationDelay: '0s' }}>
        <span className="text-4xl opacity-20">✈️</span>
      </div>
      <div className="animate-fly-across absolute top-[45%]" style={{ animationDuration: '30s', animationDelay: '8s' }}>
        <span className="text-3xl opacity-15">🦋</span>
      </div>
      <div className="animate-fly-across absolute top-[70%]" style={{ animationDuration: '35s', animationDelay: '15s' }}>
        <span className="text-3xl opacity-15">🐦</span>
      </div>

      {/* Floating stars */}
      <div className="animate-float absolute top-[20%] left-[10%]">
        <span className="text-2xl opacity-10">⭐</span>
      </div>
      <div className="animate-float-slow absolute top-[60%] right-[15%]">
        <span className="text-xl opacity-10">✨</span>
      </div>
      <div className="animate-float-delayed absolute top-[80%] left-[80%]">
        <span className="text-2xl opacity-10">🌟</span>
      </div>

      {/* Clouds */}
      <div className="animate-cloud absolute top-[8%] opacity-[0.04]">
        <svg width="120" height="60" viewBox="0 0 120 60" fill="currentColor">
          <ellipse cx="60" cy="40" rx="50" ry="20" />
          <ellipse cx="35" cy="30" rx="30" ry="20" />
          <ellipse cx="80" cy="30" rx="25" ry="18" />
          <ellipse cx="55" cy="20" rx="25" ry="15" />
        </svg>
      </div>
      <div className="animate-cloud-slow absolute top-[30%] opacity-[0.03]">
        <svg width="100" height="50" viewBox="0 0 100 50" fill="currentColor">
          <ellipse cx="50" cy="35" rx="40" ry="15" />
          <ellipse cx="30" cy="25" rx="25" ry="15" />
          <ellipse cx="65" cy="25" rx="20" ry="13" />
        </svg>
      </div>
    </div>
  );
};

export default FloatingElements;
