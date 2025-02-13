
import { GraduationCap } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full bg-[#ea384c] shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Chicago Booth MBA</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
