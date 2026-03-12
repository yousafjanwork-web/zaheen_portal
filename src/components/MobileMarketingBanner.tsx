import React, { useState } from "react";
import { X } from "lucide-react";
import { useSubscribe } from "@/hooks/useSubscribe";

const MobileMarketingBanner = () => {

  const { handleSubscribe } = useSubscribe();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-lime-500 text-white px-4 py-2 flex items-center justify-between text-sm">

      <span className="font-medium">
        Learn Skills from Rs 5/day
      </span>

      <div className="flex items-center gap-3">

        <button
          onClick={handleSubscribe}
          className="bg-white text-primary px-3 py-1 rounded-lg font-semibold"
        >
          Subscribe
        </button>

        <button onClick={() => setVisible(false)}>
          <X size={16}/>
        </button>

      </div>

    </div>
  );
};

export default MobileMarketingBanner;