import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ open }: { open: boolean }) => {

  if (!open) return null;

  return (
    <div className="lg:hidden border-t bg-white px-4 py-4 space-y-4">

      <Link to="/" className="block">Home</Link>

      <Link to="/practice" className="block">
        Practice Corner
      </Link>

      <a
        href="https://blog.zaheen.com.pk"
        target="_blank"
        className="block"
      >
        Study Material
      </a>

      <Link to="/results" className="block">
        Board Results
      </Link>

      <Link to="/ai" className="block">
        AI Tutor
      </Link>

    </div>
  );
};

export default MobileMenu;