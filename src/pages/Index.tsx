
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
    <div className="min-h-screen bg-white flex flex-col">
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

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-[#ea384c]">
                <GraduationCap className="h-6 w-6" />
                Why Booth MBA?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg mb-4">
                <img 
                  src="/lovable-uploads/0261344b-60cc-467e-ad9f-073f06ddd882.png"
                  alt="University of Chicago Campus Aerial View"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
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

      <div className="w-full bg-gray-100 border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto text-sm text-gray-600 text-center leading-relaxed">
            Hi, this is a website meant to showcase the functionality and potential of language models, as well as my personal interest in pursuing an MBA at Booth. This site is not intended for commercial use, nor is it an official or accurate representation of Booth in any way. It will be taken down after my interview period is over. Just a demonstration of what can be done today.
          </div>
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
