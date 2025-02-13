
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { MBASchedule, defaultMBASchedule } from "@/types/mba";
import { ChatSection } from "@/components/ChatSection";
import { MBAForm } from "@/components/MBAForm";
import { ScheduleViewer } from "@/components/ScheduleViewer";

interface FormData {
  MBA_Program_Type: string;
  MBA_Focus_Area: string;
  Professional_Goals: string;
  Extracurricular_Interests: string;
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sampleMBAData, setSampleMBAData] = useState<MBASchedule>(defaultMBASchedule);
  const [formData, setFormData] = useState<FormData>({
    MBA_Program_Type: "",
    MBA_Focus_Area: "",
    Professional_Goals: "",
    Extracurricular_Interests: ""
  });

  const handleScheduleGenerated = (schedule: MBASchedule, newFormData: FormData) => {
    setSampleMBAData(schedule);
    setFormData(newFormData);
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-[#ea384c] shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-10 w-10 text-white" />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white">
                  The University of Chicago Booth School of Business
                </h1>
                <p className="text-white/90 text-sm mt-1">Transforming Leaders, Shaping Global Business</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-[#ea384c]">
                <GraduationCap className="h-6 w-6" />
                Why Booth MBA?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The University of Chicago Booth School of Business offers an unparalleled MBA experience that transforms leaders and shapes global business.
              </p>
              <p className="text-gray-700">
                With a focus on academic rigor, data-driven decision making, and a flexible curriculum, Booth empowers you to chart your own path to success.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 md:row-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Chat with Phil the Phoenix
              </CardTitle>
              <div className="flex justify-center mt-4 mb-2">
                <img 
                  src="/lovable-uploads/d4e869e2-854a-4aca-adbc-9638698f84f6.png" 
                  alt="Phil the Phoenix" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              <p className="text-gray-700 text-center mt-2">
                Let Phil guide you through your Booth MBA journey and answer any questions you have.
              </p>
            </CardHeader>
            <CardContent>
              <ChatSection />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                Build Your Unique MBA Experience with Phil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MBAForm 
                onScheduleGenerated={handleScheduleGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleViewer
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        schedule={sampleMBAData}
        formData={formData}
      />
    </div>
  );
};

export default Index;
