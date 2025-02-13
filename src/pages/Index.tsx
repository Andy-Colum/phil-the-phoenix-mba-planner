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
import { jsPDF } from "jspdf";

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

  const [sampleMBAData, setSampleMBAData] = useState<MBASchedule>(defaultMBASchedule);

  // Add a test function
  const testWorkflowKey = async () => {
    try {
      const { data: workflowKey, error: workflowKeyError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'DIFY_WORKFLOW_API_KEY')
        .single();

      if (workflowKeyError) {
        console.error('Error fetching workflow API key:', workflowKeyError);
        toast({
          title: "Error",
          description: "Failed to fetch the workflow API key",
          variant: "destructive"
        });
        return;
      }

      if (!workflowKey?.value) {
        console.error('No workflow key found');
        toast({
          title: "Error",
          description: "No workflow API key found in the database",
          variant: "destructive"
        });
        return;
      }

      // Safely log key details without exposing the full key
      console.log('Workflow Key Details:', {
        length: workflowKey.value.length,
        startsWidth: workflowKey.value.substring(0, 5),
        endsWidth: workflowKey.value.slice(-5),
        hasWhitespace: /\s/.test(workflowKey.value),
        isEmpty: workflowKey.value.trim().length === 0
      });

      toast({
        title: "Success",
        description: "Check console for API key details",
      });

    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Error",
        description: "Failed to test the workflow API key",
        variant: "destructive"
      });
    }
  };

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
        console.error('Error fetching workflow API key:', workflowKeyError);
        throw new Error('Unable to access workflow API key');
      }

      if (!workflowKey?.value) {
        throw new Error('Workflow API key not found');
      }

      console.log('Workflow Key Format:', {
        keyStart: workflowKey.value.substring(0, 10) + '...',
        keyLength: workflowKey.value.length
      });

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

      console.log('API Response Status:', response.status);
      console.log('API Response Status Text:', response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`API error: ${errorData.message || response.statusText}`);
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
      const { data: chatKey, error: chatKeyError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'DIFY_CHAT_API_KEY')
        .single();

      if (chatKeyError) {
        console.error('Error fetching chat API key:', chatKeyError);
        throw new Error('Unable to access chat API key');
      }

      if (!chatKey?.value) {
        throw new Error('Chat API key not found');
      }

      console.log('Chat Key Format:', {
        keyStart: chatKey.value.substring(0, 10) + '...',
        keyLength: chatKey.value.length
      });

      const response = await fetch('https://api.dify.ai/v1/chat-messages', {
        method: 'POST',\n        headers: {\n          'Authorization': `Bearer ${chatKey.value.trim()}`,\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          inputs: {},\n          query: userMessage,\n          response_mode: \"blocking\",\n          conversation_id: \"\",\n          user: \"booth-mba-user\",\n        })\n      });

      console.log('Chat API Response Status:', response.status);
      console.log('Chat API Response Status Text:', response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Chat API Error Details:', {\n          status: response.status,\n          statusText: response.statusText,\n          errorData\n        });
        throw new Error(`API error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.answer) {
        setChatHistory(prev => [...prev, { \n          role: 'assistant', \n          content: data.answer \n        }]);
      } else {
        throw new Error('No answer received from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({\n        title: \"Error\",\n        description: error instanceof Error ? error.message : \"Unable to connect to the chat service. Please try again later.\",\n        variant: \"destructive\"\n      });
      setChatHistory(prev => [...prev, { \n        role: 'assistant', \n        content: \"I apologize, but I'm having trouble connecting right now. Please try again later.\" \n      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseDifyResponse = (output: string): MBASchedule => {
    const schedule: MBASchedule = {\n      Year_1: {\n        Autumn: { Course_1: { name: \"\", description: \"\" }, Course_2: { name: \"\", description: \"\" }, Course_3: { name: \"\", description: \"\" }, Club_Options: [], Events: [] },\n        Winter: { Course_1: { name: \"\", description: \"\" }, Course_2: { name: \"\", description: \"\" }, Course_3: { name: \"\", description: \"\" }, Club_Options: [], Events: [] },\n        Spring: { Course_1: { name: \"\", description: \"\" }, Course_2: { name: \"\", description: \"\" }, Course_3: { name: \"\", description: \"\" }, Club_Options: [], Events: [] },\n        Summer: { Internship: { name: \"\", description: \"\" } }\n      },\n      Year_2: {\n        Autumn: { Course_1: { name: \"\", description: \"\" }, Course_2: { name: \"\", description: \"\" }, Course_3: { name: \"\", description: \"\" }, Club_Options: [], Events: [] },\n        Winter: { Course_1: { name: \"\", description: \"\" }, Course_2: { name: \"\", description: \"\" }, Course_3: { name: \"\", description: \"\" }, Club_Options: [], Events: [] },\n        Spring: { Course_1: { name: \"\", description: \"\" }, Course_2: { name: \"\", description: \"\" }, Course_3: { name: \"\", description: \"\" }, Club_Options: [], Events: [] },\n        Summer: { Internship: { name: \"\", description: \"\" } }\n      }\n    };\n\n    const lines = output.split('\\n');\n    let currentYear: 'Year_1' | 'Year_2' | null = null;\n    let currentTerm: 'Autumn' | 'Winter' | 'Spring' | 'Summer' | null = null;\n    let currentSection: 'courses' | 'clubs' | 'events' | 'internship' | null = null;\n\n    for (let line of lines) {\n      line = line.trim();\n      \n      if (line.startsWith('Year 1:')) {\n        currentYear = 'Year_1';\n      } else if (line.startsWith('Year 2:')) {\n        currentYear = 'Year_2';\n      } else if (['Autumn:', 'Winter:', 'Spring:', 'Summer:'].some(term => line.startsWith(term))) {\n        currentTerm = line.split(':')[0] as 'Autumn' | 'Winter' | 'Spring' | 'Summer';\n        currentSection = 'courses';\n      } else if (line.startsWith('Club Options:')) {\n        currentSection = 'clubs';\n      } else if (line.startsWith('Events:')) {\n        currentSection = 'events';\n      } else if (line.startsWith('Internship:')) {\n        currentSection = 'internship';\n      }\n\n      if (currentYear && currentTerm && line.startsWith('- Course 1:')) {\n        const [name, description] = line.replace('- Course 1:', '').split(' - ').map(s => s.trim());\n        if (currentTerm !== 'Summer') {\n          schedule[currentYear][currentTerm].Course_1 = { name, description };\n        }\n      } else if (currentYear && currentTerm && line.startsWith('- Course 2:')) {\n        const [name, description] = line.replace('- Course 2:', '').split(' - ').map(s => s.trim());\n        if (currentTerm !== 'Summer') {\n          schedule[currentYear][currentTerm].Course_2 = { name, description };\n        }\n      } else if (currentYear && currentTerm && line.startsWith('- Course 3:')) {\n        const [name, description] = line.replace('- Course 3:', '').split(' - ').map(s => s.trim());\n        if (currentTerm !== 'Summer') {\n          schedule[currentYear][currentTerm].Course_3 = { name, description };\n        }\n      } else if (currentYear && currentTerm && currentSection === 'clubs' && line.startsWith('-')) {\n        const club = line.replace('-', '').trim();\n        if (currentTerm !== 'Summer') {\n          schedule[currentYear][currentTerm].Club_Options.push(club);\n        }\n      } else if (currentYear && currentTerm && currentSection === 'events' && line.startsWith('-')) {\n        const event = line.replace('-', '').trim();\n        if (currentTerm !== 'Summer') {\n          schedule[currentYear][currentTerm].Events.push(event);\n        }\n      } else if (currentYear && currentTerm && currentSection === 'internship' && line.startsWith('-')) {\n        const [name, description] = line.replace('- ', '').split(' - ').map(s => s.trim());\n        if (currentTerm === 'Summer') {\n          schedule[currentYear][currentTerm].Internship = { name, description };\n        }\n      }\n    }\n\n    return schedule;\n  };

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

  // Add button to UI right after the chat section
  const renderTestSection = () => (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">API Testing Section</h3>
      <Button 
        onClick={testWorkflowKey}
        variant="outline"
        className="w-full"
      >
        Test Workflow API Key
      </Button>
    </div>
  );

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

          {/* Test Section Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            {renderTestSection()}
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
                        <span
