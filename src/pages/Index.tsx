import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Briefcase,
  ChartBar,
  Rocket,
  Target,
  Database,
  Globe,
  MessageSquare,
  ArrowRight,
  Users,
  Building,
  Calendar,
  BookOpen,
  Laptop,
  LineChart,
  Loader,
  Download
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [MBA_Program_Type, setMBA_Program_Type] = useState("");
  const [MBA_Focus_Area, setMBA_Focus_Area] = useState("");
  const [Professional_Goals, setProfessional_Goals] = useState("");
  const [Extracurricular_Interests, setExtracurricular_Interests] = useState("");

  const defaultMBASchedule: MBASchedule = {
    Year_1: {
      Autumn: {
        Course_1: { name: "", description: "" },
        Course_2: { name: "", description: "" },
        Course_3: { name: "", description: "" },
        Club_Options: [],
        Events: []
      },
      Winter: {
        Course_1: { name: "", description: "" },
        Course_2: { name: "", description: "" },
        Course_3: { name: "", description: "" },
        Club_Options: [],
        Events: []
      },
      Spring: {
        Course_1: { name: "", description: "" },
        Course_2: { name: "", description: "" },
        Course_3: { name: "", description: "" },
        Club_Options: [],
        Events: []
      },
      Summer: {
        Internship: { name: "", description: "" }
      }
    },
    Year_2: {
      Autumn: {
        Course_1: { name: "", description: "" },
        Course_2: { name: "", description: "" },
        Course_3: { name: "", description: "" },
        Club_Options: [],
        Events: []
      },
      Winter: {
        Course_1: { name: "", description: "" },
        Course_2: { name: "", description: "" },
        Course_3: { name: "", description: "" },
        Club_Options: [],
        Events: []
      },
      Spring: {
        Course_1: { name: "", description: "" },
        Course_2: { name: "", description: "" },
        Course_3: { name: "", description: "" },
        Club_Options: [],
        Events: []
      },
      Summer: {
        Internship: { name: "", description: "" }
      }
    }
  };

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
      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-zA9ZDv20AN3bzw4fbTCis0KJ',
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
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dify API Response:', data);

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
        description: "Unable to generate your MBA schedule. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const scheduleData = {
      studentInfo: {
        programType: MBA_Program_Type,
        focusArea: MBA_Focus_Area,
        professionalGoals: Professional_Goals,
        extracurricularInterests: Extracurricular_Interests
      },
      schedule: sampleMBAData
    };

    const blob = new Blob([JSON.stringify(scheduleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booth-mba-schedule.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Your MBA schedule has been downloaded successfully!",
    });
  };

  type CourseData = {
    name: string;
    description: string;
  };

  type TermData = {
    Course_1: CourseData;
    Course_2: CourseData;
    Course_3: CourseData;
    Club_Options: string[];
    Events: string[];
  };

  type SummerData = {
    Internship: {
      name: string;
      description: string;
    };
  };

  type YearData = {
    Autumn: TermData;
    Winter: TermData;
    Spring: TermData;
    Summer: SummerData;
  };

  type MBASchedule = {
    Year_1: YearData;
    Year_2: YearData;
  };

  const handleStartChat = () => {
    setChatStarted(true);
    setChatHistory([{ 
      role: 'assistant', 
      content: "Hi! I'm Phil the Phoenix, your MBA guide. I'd be happy to help you learn more about the Booth MBA experience. What would you like to know?"
    }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setChatMessage("");
    
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.dify.ai/v1/chat-messages', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-BMVzb50wyz8hw04pC90s3Rig',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: userMessage,
          response_mode: "blocking",
          conversation_id: "",
          user: "booth-mba-user",
        })
      });

      if (!response.ok) {
        throw new Error(`Dify API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.answer) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: data.answer 
        }]);
      } else {
        throw new Error('No answer received from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Unable to connect to the chat service. Please try again later.",
        variant: "destructive"
      });
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseDifyResponse = (output: string): MBASchedule => {
    const schedule: MBASchedule = {
      Year_1: {
        Autumn: { Course_1: { name: "", description: "" }, Course_2: { name: "", description: "" }, Course_3: { name: "", description: "" }, Club_Options: [], Events: [] },
        Winter: { Course_1: { name: "", description: "" }, Course_2: { name: "", description: "" }, Course_3: { name: "", description: "" }, Club_Options: [], Events: [] },
        Spring: { Course_1: { name: "", description: "" }, Course_2: { name: "", description: "" }, Course_3: { name: "", description: "" }, Club_Options: [], Events: [] },
        Summer: { Internship: { name: "", description: "" } }
      },
      Year_2: {
        Autumn: { Course_1: { name: "", description: "" }, Course_2: { name: "", description: "" }, Course_3: { name: "", description: "" }, Club_Options: [], Events: [] },
        Winter: { Course_1: { name: "", description: "" }, Course_2: { name: "", description: "" }, Course_3: { name: "", description: "" }, Club_Options: [], Events: [] },
        Spring: { Course_1: { name: "", description: "" }, Course_2: { name: "", description: "" }, Course_3: { name: "", description: "" }, Club_Options: [], Events: [] },
        Summer: { Internship: { name: "", description: "" } }
      }
    };

    const lines = output.split('\n');
    let currentYear: 'Year_1' | 'Year_2' | null = null;
    let currentTerm: 'Autumn' | 'Winter' | 'Spring' | 'Summer' | null = null;
    let currentSection: 'courses' | 'clubs' | 'events' | 'internship' | null = null;

    for (let line of lines) {
      line = line.trim();
      
      if (line.startsWith('Year 1:')) {
        currentYear = 'Year_1';
      } else if (line.startsWith('Year 2:')) {
        currentYear = 'Year_2';
      } else if (['Autumn:', 'Winter:', 'Spring:', 'Summer:'].some(term => line.startsWith(term))) {
        currentTerm = line.split(':')[0] as 'Autumn' | 'Winter' | 'Spring' | 'Summer';
        currentSection = 'courses';
      } else if (line.startsWith('Club Options:')) {
        currentSection = 'clubs';
      } else if (line.startsWith('Events:')) {
        currentSection = 'events';
      } else if (line.startsWith('Internship:')) {
        currentSection = 'internship';
      }

      if (currentYear && currentTerm && line.startsWith('- Course 1:')) {
        const [name, description] = line.replace('- Course 1:', '').split(' - ').map(s => s.trim());
        if (currentTerm !== 'Summer') {
          schedule[currentYear][currentTerm].Course_1 = { name, description };
        }
      } else if (currentYear && currentTerm && line.startsWith('- Course 2:')) {
        const [name, description] = line.replace('- Course 2:', '').split(' - ').map(s => s.trim());
        if (currentTerm !== 'Summer') {
          schedule[currentYear][currentTerm].Course_2 = { name, description };
        }
      } else if (currentYear && currentTerm && line.startsWith('- Course 3:')) {
        const [name, description] = line.replace('- Course 3:', '').split(' - ').map(s => s.trim());
        if (currentTerm !== 'Summer') {
          schedule[currentYear][currentTerm].Course_3 = { name, description };
        }
      } else if (currentYear && currentTerm && currentSection === 'clubs' && line.startsWith('-')) {
        const club = line.replace('-', '').trim();
        if (currentTerm !== 'Summer') {
          schedule[currentYear][currentTerm].Club_Options.push(club);
        }
      } else if (currentYear && currentTerm && currentSection === 'events' && line.startsWith('-')) {
        const event = line.replace('-', '').trim();
        if (currentTerm !== 'Summer') {
          schedule[currentYear][currentTerm].Events.push(event);
        }
      } else if (currentYear && currentTerm && currentSection === 'internship' && line.startsWith('-')) {
        const [name, description] = line.replace('- ', '').split(' - ').map(s => s.trim());
        if (currentTerm === 'Summer') {
          schedule[currentYear][currentTerm].Internship = { name, description };
        }
      }
    }

    return schedule;
  };

  const TermBlock = ({ data, term }: { data: TermData | SummerData; term: string }) => {
    const isSummer = term === "Summer";
    
    return (
      <Collapsible className="w-full">
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <h4 className="font-medium text-lg">{term}</h4>
            <ArrowRight className="h-5 w-5 transform transition-transform group-open:rotate-90" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-4 bg-gray-50 rounded-lg mt-2">
          {!isSummer ? (
            <>
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">Courses</h5>
                <div className="space-y-3">
                  {(['Course_1', 'Course_2', 'Course_3'] as const).map((courseKey) => {
                    const course = (data as TermData)[courseKey];
                    return (
                      <div key={courseKey} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-[#ea384c]" />
                          <h6 className="font-medium">{course.name}</h6>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-6">{course.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">Clubs</h5>
                <ul className="space-y-2">
                  {(data as TermData).Club_Options.map((club, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {club}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2">Events</h5>
                <ul className="space-y-2">
                  {(data as TermData).Events.map((event, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div>
              <h5 className="font-medium text-sm text-gray-700 mb-2">Internship</h5>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#ea384c]" />
                  <h6 className="font-medium">{(data as SummerData).Internship.name}</h6>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-6">
                  {(data as SummerData).Internship.description}
                </p>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="min-h-screen bg-white">
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
                Your MBA Journey Starts Here
              </CardTitle>
              <p className="text-gray-700 text-center mt-2">
                Let Phil guide you to answer any of your questions about MBA or Booth.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {!chatStarted ? (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleStartChat}
                    className="bg-[#ea384c] hover:bg-[#d42d3d] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 animate-fade-in"
                  >
                    Talk to Phil
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4 border rounded-lg">
                    {chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-[#ea384c] text-white ml-4'
                              : 'bg-gray-100 text-gray-800 mr-4'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                          Phil is typing...
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      className="bg-[#ea384c] hover:bg-[#d42d3d] text-white"
                      disabled={isLoading}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>

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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 2: Select Your Focus Area</label>
                  <Select onValueChange={setMBA_Focus_Area} value={MBA_Focus_Area}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Finance_Accounting">
                        <span className="flex items-center gap-2">
                          <LineChart className="h-4 w-4" />
                          Finance & Accounting
                        </span>
                      </SelectItem>
                      <SelectItem value="Entrepreneurship_Innovation">
                        <span className="flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          Entrepreneurship & Innovation
                        </span>
                      </SelectItem>
                      <SelectItem value="Marketing_Strategy">
                        <span className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Marketing & Strategy
                        </span>
                      </SelectItem>
                      <SelectItem value="Data_Analytics_Tech">
                        <span className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          Data Analytics & Tech
                        </span>
                      </SelectItem>
                      <SelectItem value="International_Business">
                        <span className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          International Business
                        </span>
                      </SelectItem>
                      <SelectItem value="Public_Policy_Impact">
                        <span className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Public Policy & Impact
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 3: Professional Goals</label>
                  <Input
                    placeholder="What are your career aspirations and professional objectives?"
                    value={Professional_Goals}
                    onChange={(e) => setProfessional_Goals(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Step 4: Extracurricular Interests</label>
                  <Input
                    placeholder="What activities, clubs, or experiences interest you?"
                    value={Extracurricular_Interests}
                    onChange={(e) => setExtracurricular_Interests(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#ea384c] hover:bg-[#d42d3d] text-white font-semibold"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Generating Your MBA Journey...
                    </>
                  ) : (
                    <>
                      Generate Your MBA Journey
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="w-[90%] sm:w-[540px] h-[80vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-y-auto"
        >
          <SheetHeader className="flex justify-between items-center">
            <SheetTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your Two-Year MBA Journey at Booth
            </SheetTitle>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Schedule
            </Button>
          </SheetHeader>
          
          <div className="mt-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Year 1</h3>
              <div className="space-y-4">
                <TermBlock data={sampleMBAData.Year_1.Autumn} term="Autumn Quarter" />
                <TermBlock data={sampleMBAData.Year_1.Winter} term="Winter Quarter" />
                <TermBlock data={sampleMBAData.Year_1.Spring} term="Spring Quarter" />
                <TermBlock data={sampleMBAData.Year_1.Summer} term="Summer" />
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="text-xl font-semibold mb-4">Year 2</h3>
              <div className="space-y-4">
                <TermBlock data={sampleMBAData.Year_2.Autumn} term="Autumn Quarter" />
                <TermBlock data={sampleMBAData.Year_2.Winter} term="Winter Quarter" />
                <TermBlock data={sampleMBAData.Year_2.Spring} term="Spring Quarter" />
                <TermBlock data={sampleMBAData.Year_2.Summer} term="Summer" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">AI-Generated Insights</h4>
              <p className="text-sm text-gray-600">
                Based on your interests in {MBA_Focus_Area?.replace(/_/g, ' ')} and {Extracurricular_Interests}, 
                here are some recommended courses and activities tailored to your goals: {Professional_Goals}
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
