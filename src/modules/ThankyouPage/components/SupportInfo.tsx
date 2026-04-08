import { Info } from "lucide-react";

export default function SupportInfo() {
  return (
    <div className="mt-20 text-sm flex items-center gap-2">
      <Info className="w-4 h-4" />
      Trouble accessing?{" "}
      <a href="#" className="text-blue-600 font-bold">
        Contact Support
      </a>
    </div>
  );
}