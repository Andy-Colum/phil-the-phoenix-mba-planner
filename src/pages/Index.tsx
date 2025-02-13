import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Briefcase
} from "lucide-react";
import { jsPDF } from "jspdf";
import { MBASchedule, defaultMBASchedule } from "@/types/mba";
import { Header } from "@/components/Header";
import { Chat } from "@/components/Chat";
import { TestSection } from "@/components/TestSection";
import { TermBlock } from "@/components/TermBlock";

const Index = () => {
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [MBA_Program_Type, setMBA_Program_Type] = useState("");
  const [MBA_Focus_Area, setMBA_Focus_Area] = useState("");
  const [Professional_Goals, setProfessional_Goals] = useState("");
  const [Extracurricular_Interests, setExtracurricular_Interests] = useState("");

  const [sampleMBAData, setSampleMBAData] = useState<MBASchedule>(defaultMBASchedule);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!MBA_Program_Type || !MBA_Focus_Area || !Professional_Goals || !Extracurricular_Interests) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating your MBA schedule.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data: workflowKey, error: workflowKeyError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'DIFY_WORKFLOW_API_KEY')
        .single();

      if (workflowKeyError) {
        throw new Error('Unable to access workflow API key');
      }

      if (!workflowKey?.value) {
        throw new Error('Workflow API key not found');
      }

      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${workflowKey.value.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            MBA_Program_Type,
            MBA_Focus_Area,
            Professional_Goals,
            Extracurricular_Interests
          },
          response_mode: "blocking",
          user: "booth-mba-user"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();

      if (data?.data?.outputs?.output) {
        try {
          const scheduleData: MBASchedule = JSON.parse(data.data.outputs.output);
          
          if (scheduleData?.Year_1?.Autumn && scheduleData?.Year_2?.Autumn) {
            setSampleMBAData(scheduleData);
            setIsSheetOpen(true);
            
            toast({
              title: "Success",
              description: "Your MBA schedule has been generated successfully!",
            });
          } else {
            throw new Error('Invalid schedule data structure');
          }
        } catch (parseError) {
          console.error('Error parsing schedule:', parseError);
          toast({
            title: "Error",
            description: "Unable to process the schedule data. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error('No output received from API');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unable to generate your MBA schedule. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    const lineHeight = 7;
    const indent = 5;
    
    // Title and Student Info
    doc.setFontSize(16);
    doc.text("Chicago Booth MBA Schedule", 10, yOffset);
    yOffset += lineHeight * 2;

    doc.setFontSize(12);
    doc.text("Student Information:", 10, yOffset);
    yOffset += lineHeight;
    doc.setFontSize(10);
    doc.text(`Program Type: ${MBA_Program_Type.replace(/_/g, ' ')}`, 10 + indent, yOffset);
    yOffset += lineHeight;
    doc.text(`Focus Area: ${MBA_Focus_Area.replace(/_/g, ' ')}`, 10 + indent, yOffset);
    yOffset += lineHeight;
    doc.text(`Professional Goals: ${Professional_Goals}`, 10 + indent, yOffset);
    yOffset += lineHeight;
    doc.text(`Extracurricular Interests: ${Extracurricular_Interests}`, 10 + indent, yOffset);
    yOffset += lineHeight * 2;

    // Helper function to add text with word wrap
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
      const words = text.split(' ');
      let line = '';
      let newY = y;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        if (doc.getTextWidth(testLine) > maxWidth) {
          doc.text(line, x, newY);
          line = words[i] + ' ';
          newY += lineHeight;
        } else {
          line = testLine;
        }
      }
      doc.text(line, x, newY);
      return newY;
    };

    // Function to add a term's details
    const addTermDetails = (term: TermData | SummerData, termName: string, startY: number, isSummer: boolean = false) => {
      let y = startY;
      
      doc.setFontSize(12);
      doc.text(termName, 10, y);
      y += lineHeight;
      
      doc.setFontSize(10);
      if (!isSummer) {
        const regularTerm = term as TermData;
        // Courses
        doc.text("Courses:", 10 + indent, y);
        y += lineHeight;
        
        ['Course_1', 'Course_2', 'Course_3'].forEach((courseKey) => {
          const course = regularTerm[courseKey as keyof TermData] as CourseData;
          doc.text(`• ${course.name}`, 10 + indent * 2, y);
          y += lineHeight;
          y = addWrappedText(course.description, 10 + indent * 3, y, 180) + lineHeight;
        });

        // Clubs
        doc.text("Club Options:", 10 + indent, y);
        y += lineHeight;
        regularTerm.Club_Options.forEach(club => {
          doc.text(`• ${club}`, 10 + indent * 2, y);
          y += lineHeight;
        });

        // Events
        doc.text("Events:", 10 + indent, y);
        y += lineHeight;
        regularTerm.Events.forEach(event => {
          doc.text(`• ${event}`, 10 + indent * 2, y);
          y += lineHeight;
        });
      } else {
        const summerTerm = term as SummerData;
        doc.text("Internship:", 10 + indent, y);
        y += lineHeight;
        doc.text(`• ${summerTerm.Internship.name}`, 10 + indent * 2, y);
        y += lineHeight;
        y = addWrappedText(summerTerm.Internship.description, 10 + indent * 3, y, 180) + lineHeight;
      }
      
      return y + lineHeight;
    };

    // Year 1
    doc.setFontSize(14);
    doc.text("Year 1", 10, yOffset);
    yOffset += lineHeight * 1.5;

    ['Autumn', 'Winter', 'Spring'].forEach(term => {
      yOffset = addTermDetails(sampleMBAData.Year_1[term as keyof YearData], `${term} Quarter`, yOffset);
      
      // Add new page if we're running out of space
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 10;
      }
    });
    
    yOffset = addTermDetails(sampleMBAData.Year_1.Summer, "Summer", yOffset, true);

    // Year 2
    doc.addPage();
    yOffset = 10;
    doc.setFontSize(14);
    doc.text("Year 2", 10, yOffset);
    yOffset += lineHeight * 1.5;

    ['Autumn', 'Winter', 'Spring'].forEach(term => {
      yOffset = addTermDetails(sampleMBAData.Year_2[term as keyof YearData], `${term} Quarter`, yOffset);
      
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 10;
      }
    });
    
    yOffset = addTermDetails(sampleMBAData.Year_2.Summer, "Summer", yOffset, true);

    // Save the PDF
    doc.save('booth-mba-schedule.pdf');

    toast({
      title: "Download Started",
      description: "Your MBA schedule has been downloaded as a PDF!",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Why Booth MBA Card */}
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

          {/* Chat Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 md:row-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Your MBA Journey Starts Here
              </CardTitle>
              <p className="text-gray-700 text-center mt-2">
                Let Phil guide you to answer any of your questions about MBA or Booth.
              </p>
            </CardHeader>
            <CardContent>
              <Chat />
            </CardContent>
          </Card>

          {/* Test Section Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <TestSection />
          </Card>

          {/* MBA Experience Form Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                Build Your Unique MBA Experience with Phil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 1: Select Your MBA Program</label>
                  <Select onValueChange={setMBA_Program_Type} value={MBA_Program_Type}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full_Time_MBA">
                        <span className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Full-Time MBA
                        </span>
                      </SelectItem>
                      <SelectItem value="Evening_MBA">
                        <span className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Evening MBA
                        </span>
                      </SelectItem>
                      <SelectItem value="Weekend_MBA">
                        <span className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Weekend MBA
                        </span>
                      </SelectItem>
                      <SelectItem value="Executive_MBA">
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Executive MBA
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Focus Area Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 2: Select Your Focus Area</label>
                  <Select onValueChange={setMBA_Focus_Area} value={MBA_Focus_Area}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                      <SelectItem value="Strategy">Strategy</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Professional Goals Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 3: Professional Goals</label>
                  <Input
                    value={Professional_Goals}
                    onChange={(e) => setProfessional_Goals(e.target.value)}
                    placeholder="Enter your professional goals"
                  />
                </div>

                {/* Extracurricular Interests Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 4: Extracurricular Interests</label>
                  <Input
                    value={Extracurricular_Interests}
                    onChange={(e) => setExtracurricular_Interests(e.target.value)}
                    placeholder="Enter your extracurricular interests"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#ea384c] hover:bg-[#d42d3d]"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Your MBA Schedule"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Your Personalized MBA Schedule</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <Button onClick={handleDownload} className="w-full">
              Download Schedule as PDF
            </Button>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Year 1</h3>
              <div className="space-y-4">
                <TermBlock data={sampleMBAData.Year_1.Autumn} term="Autumn" />
                <TermBlock data={sampleMBAData.Year_1.Winter} term="Winter" />
                <TermBlock data={sampleMBAData.Year_1.Spring} term="Spring" />
                <TermBlock data={sampleMBAData.Year_1.Summer} term="Summer" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Year 2</h3>
              <div className="space-y-4">
                <TermBlock data={sampleMBAData.Year_2.Autumn} term="Autumn" />
                <TermBlock data={sampleMBAData.Year_2.Winter} term="Winter" />
                <TermBlock data={sampleMBAData.Year_2.Spring} term="Spring" />
                <TermBlock data={sampleMBAData.Year_2.Summer} term="Summer" />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
