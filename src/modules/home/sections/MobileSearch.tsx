import React from "react";
import { Search } from "lucide-react";

const MobileSearch = () => {
  return (
    <div className="px-4 py-4">

      <div className="flex items-center border rounded-xl px-4 py-3 bg-white shadow-sm">

        <input
          type="text"
          placeholder="What do you want to learn?"
          className="flex-1 outline-none text-sm"
        />

        <Search size={18} className="text-slate-400" />

      </div>

    </div>
  );
};

export default MobileSearch;