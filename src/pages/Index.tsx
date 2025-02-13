import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Briefcase,
  MessageSquare,
  ArrowRight,
  Target,
  Database,
  Globe,
  Building,
  Rocket,
  LineChart
} from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { MBAJourney } from "@/components/MBAJourney";

const defaultMBAData = {
  Year_1: {
    Autumn: {
      Course_1: {
        name: "Financial Accounting",
        description: "Learn the fundamentals of financial accounting and reporting."
      },
      Course_2: {
        name: "Microeconomics",
        description: "Study principles of microeconomics and market behavior."
      },
      Course_3: {
        name: "Leadership Development",
        description: "Develop essential leadership and management skills."
      },
      Club_Options: ["Finance Club", "Consulting Club"],
      Events: ["Fall Career Fair", "Leadership Workshop"]
    },
    Winter: {
      Course_1: {
        name: "Marketing Strategy",
        description: "Learn key marketing concepts and strategic planning."
      },
      Course_2: {
        name: "Data Analytics",
        description: "Master data analysis techniques and tools."
      },
      Course_3: {
        name: "Operations Management",
        description: "Study operations and supply chain management."
      },
      Club_Options: ["Marketing Club", "Tech Club"],
      Events: ["Winter Networking Event", "Analytics Conference"]
    },
    Spring: {
      Course_1: {
        name: "Corporate Finance",
        description: "Study corporate financial management and strategy."
      },
      Course_2: {
        name: "Strategic Management",
        description: "Learn strategic planning and execution."
      },
      Course_3: {
        name: "Business Analytics",
        description: "Advanced business analytics applications."
      },
      Club_Options: ["Investment Club", "Strategy Club"],
      Events: ["Spring Career Fair", "Strategy Summit"]
    },
    Summer: {
      Internship: {
        name: "Summer Internship Program",
        description: "Gain hands-on experience in your chosen field."
      }
    }
  },
  Year_2: {
    Autumn: {
      Course_1: {
        name: "Advanced Finance",
        description: "Deep dive into advanced financial concepts."
      },
      Course_2: {
        name: "Entrepreneurship",
        description: "Learn startup fundamentals and venture creation."
      },
      Course_3: {
        name: "Global Business",
        description: "Study international business strategies."
      },
      Club_Options: ["Entrepreneurship Club", "Global Business Club"],
      Events: ["Startup Competition", "Global Business Forum"]
    },
    Winter: {
      Course_1: {
        name: "Digital Innovation",
        description: "Explore digital transformation strategies."
      },
      Course_2: {
        name: "Negotiation",
        description: "Master negotiation techniques and strategies."
      },
      Course_3: {
        name: "Risk Management",
        description: "Study risk assessment and management."
      },
      Club_Options: ["Innovation Club", "Leadership Club"],
      Events: ["Innovation Summit", "Leadership Conference"]
    },
    Spring: {
      Course_1: {
        name: "Business Ethics",
        description: "Study ethical decision-making in business."
      },
      Course_2: {
        name: "Strategic Leadership",
        description: "Advanced leadership development."
      },
      Course_3: {
        name: "Capstone Project",
        description: "Apply MBA knowledge to real-world projects."
      },
      Club_Options: ["Ethics Club", "Alumni Network"],
      Events: ["Graduation Ceremony", "Final Presentation"]
    },
    Summer: {
      Internship: {
        name: "Career Transition",
        description: "Prepare for post-MBA career opportunities."
      }
    }
  }
};

const Index = () => {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [MBA_Program_Type, setMBA_Program_Type] = useState("");
  const [MBA_Focus_Area, setMBA_Focus_Area] = useState("");
  const [Professional_Goals, setProfessional_Goals] = useState("");
  const [Extracurricular_Interests, setExtracurricular_Interests] = useState("");
  const [mbaSchedule, setMBASchedule] = useState(defaultMBAData);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

    const requestBody = {
      query: MBA_Program_Type, // This will be the main query parameter
      inputs: {
        program_type: MBA_Program_Type,
        focus_area: MBA_Focus_Area,
        professional_goals: Professional_Goals,
        extracurricular_interests: Extracurricular_Interests
      },
      response_mode: "blocking",
      user: "booth-mba-user"
    };

    console.log('Request body being sent to API:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer app-zA9ZDv20AN3bzw4fbTCis0KJ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      if (data.data && data.data.outputs) {
        try {
          let schedule;
          if (typeof data.data.outputs === 'string') {
            schedule = JSON.parse(data.data.outputs);
          } else if (data.data.outputs.text) {
            schedule = JSON.parse(data.data.outputs.text);
          } else {
            throw new Error('Invalid response format');
          }

          setMBASchedule(schedule);
          setIsSheetOpen(true);
          toast({
            title: "Success",
            description: "Your personalized MBA journey has been generated!",
          });
        } catch (error) {
          console.error('Error parsing schedule:', error);
          toast({
            title: "Error",
            description: "Unable to process the generated schedule. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: "Error",
        description: "Unable to generate your MBA schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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
                      <SelectItem value="Full-Time_MBA">
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
                    <div className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Generating Your Journey...
                    </div>
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

      <MBAJourney 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        schedule={mbaSchedule}
      />
    </div>
  );
};

export default Index;
