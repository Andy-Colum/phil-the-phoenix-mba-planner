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
  LineChart
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

  const [MBA_Program_Type, setMBA_Program_Type] = useState("");
  const [MBA_Focus_Area, setMBA_Focus_Area] = useState("");
  const [Professional_Goals, setProfessional_Goals] = useState("");
  const [Extracurricular_Interests, setExtracurricular_Interests] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const [sampleMBAData, setSampleMBAData] = useState<MBASchedule>({
    Year_1: {
      Autumn: {
        Course_1: {
          name: "Financial Accounting",
          description: "Learn the fundamentals of financial accounting."
        },
        Course_2: {
          name: "Microeconomics",
          description: "Explore the principles of microeconomics."
        },
        Course_3: {
          name: "Leadership Development",
          description: "Develop essential leadership skills."
        },
        Club_Options: [
          "Investment Banking Group",
          "Consulting Club"
        ],
        Events: [
          "Fall Career Fair",
          "Alumni Networking Night"
        ]
      },
      Winter: {
        Course_1: {
          name: "Corporate Finance",
          description: "Study corporate finance and investment strategies."
        },
        Course_2: {
          name: "Marketing Strategy",
          description: "Develop marketing strategies and tactics."
        },
        Course_3: {
          name: "Operations Management",
          description: "Learn about operations management and supply chain."
        },
        Club_Options: [
          "Case Competition Club",
          "Tech Group"
        ],
        Events: [
          "Winter Conference",
          "Industry Speaker Series"
        ]
      },
      Spring: {
        Course_1: {
          name: "Managerial Accounting",
          description: "Gain a deeper understanding of managerial accounting."
        },
        Course_2: {
          name: "Business Strategy",
          description: "Develop strategic business planning skills."
        },
        Course_3: {
          name: "Data Analytics",
          description: "Learn data analytics and its applications."
        },
        Club_Options: [
          "Entrepreneurship Club",
          "Social Impact Group"
        ],
        Events: [
          "Spring Networking Event",
          "Startup Pitch Competition"
        ]
      },
      Summer: {
        Internship: {
          name: "Summer Internship Program",
          description: "Gain hands-on experience in a real-world setting."
        }
      }
    },
    Year_2: {
      Autumn: {
        Course_1: {
          name: "Advanced Finance",
          description: "Study advanced financial concepts and models."
        },
        Course_2: {
          name: "Strategic Leadership",
          description: "Develop strategic leadership skills."
        },
        Course_3: {
          name: "Global Markets",
          description: "Explore global markets and international finance."
        },
        Club_Options: [
          "Finance Club Leadership",
          "Mentor Program"
        ],
        Events: [
          "Leadership Summit",
          "Career Trek"
        ]
      },
      Winter: {
        Course_1: {
          name: "Negotiation",
          description: "Learn the art of negotiation and conflict resolution."
        },
        Course_2: {
          name: "Innovation Strategy",
          description: "Develop innovative strategies and approaches."
        },
        Course_3: {
          name: "Business Analytics",
          description: "Learn business analytics and its applications."
        },
        Club_Options: [
          "Venture Capital Club",
          "Data Analytics Group"
        ],
        Events: [
          "Winter Networking Event",
          "Industry Panel"
        ]
      },
      Spring: {
        Course_1: {
          name: "International Business",
          description: "Study international business and global markets."
        },
        Course_2: {
          name: "Entrepreneurial Finance",
          description: "Learn about entrepreneurial finance and venture capital."
        },
        Course_3: {
          name: "Digital Strategy",
          description: "Develop digital strategy and innovation."
        },
        Club_Options: [
          "Graduation Committee",
          "Alumni Network"
        ],
        Events: [
          "Graduation Gala",
          "Final Presentation"
        ]
      },
      Summer: {
        Internship: {
          name: "Post-MBA Career Transition",
          description: "Prepare for your post-MBA career transition."
        }
      }
    }
  });

  interface DifyResponse {
    workflow_run_id: string;
    task_id: string;
    data: {
      id: string;
      workflow_id: string;
      status: 'running' | 'succeeded' | 'failed' | 'stopped';
      outputs?: MBASchedule;
      error?: string;
      elapsed_time?: number;
      total_tokens?: number;
      total_steps?: number;
      created_at: string;
      finished_at?: string;
    };
  }

  const [MBASchedule, setMBASchedule] = useState<MBASchedule>({
    Year_1: {
      Autumn: {
        Course_1: {
          name: "Financial Accounting",
          description: "Learn the fundamentals of financial accounting."
        },
        Course_2: {
          name: "Microeconomics",
          description: "Explore the principles of microeconomics."
        },
        Course_3: {
          name: "Leadership Development",
          description: "Develop essential leadership skills."
        },
        Club_Options: [
          "Investment Banking Group",
          "Consulting Club"
        ],
        Events: [
          "Fall Career Fair",
          "Alumni Networking Night"
        ]
      },
      Winter: {
        Course_1: {
          name: "Corporate Finance",
          description: "Study corporate finance and investment strategies."
        },
        Course_2: {
          name: "Marketing Strategy",
          description: "Develop marketing strategies and tactics."
        },
        Course_3: {
          name: "Operations Management",
          description: "Learn about operations management and supply chain."
        },
        Club_Options: [
          "Case Competition Club",
          "Tech Group"
        ],
        Events: [
          "Winter Conference",
          "Industry Speaker Series"
        ]
      },
      Spring: {
        Course_1: {
          name: "Managerial Accounting",
          description: "Gain a deeper understanding of managerial accounting."
        },
        Course_2: {
          name: "Business Strategy",
          description: "Develop strategic business planning skills."
        },
        Course_3: {
          name: "Data Analytics",
          description: "Learn data analytics and its applications."
        },
        Club_Options: [
          "Entrepreneurship Club",
          "Social Impact Group"
        ],
        Events: [
          "Spring Networking Event",
          "Startup Pitch Competition"
        ]
      },
      Summer: {
        Internship: {
          name: "Summer Internship Program",
          description: "Gain hands-on experience in a real-world setting."
        }
      }
    },
    Year_2: {
      Autumn: {
        Course_1: {
          name: "Advanced Finance",
          description: "Study advanced financial concepts and models."
        },
        Course_2: {
          name: "Strategic Leadership",
          description: "Develop strategic leadership skills."
        },
        Course_3: {
          name: "Global Markets",
          description: "Explore global markets and international finance."
        },
        Club_Options: [
          "Finance Club Leadership",
          "Mentor Program"
        ],
        Events: [
          "Leadership Summit",
          "Career Trek"
        ]
      },
      Winter: {
        Course_1: {
          name: "Negotiation",
          description: "Learn the art of negotiation and conflict resolution."
        },
        Course_2: {
          name: "Innovation Strategy",
          description: "Develop innovative strategies and approaches."
        },
        Course_3: {
          name: "Business Analytics",
          description: "Learn business analytics and its applications."
        },
        Club_Options: [
          "Venture Capital Club",
          "Data Analytics Group"
        ],
        Events: [
          "Winter Networking Event",
          "Industry Panel"
        ]
      },
      Spring: {
        Course_1: {
          name: "International Business",
          description: "Study international business and global markets."
        },
        Course_2: {
          name: "Entrepreneurial Finance",
          description: "Learn about entrepreneurial finance and venture capital."
        },
        Course_3: {
          name: "Digital Strategy",
          description: "Develop digital strategy and innovation."
        },
        Club_Options: [
          "Graduation Committee",
          "Alumni Network"
        ],
        Events: [
          "Graduation Gala",
          "Final Presentation"
        ]
      },
      Summer: {
        Internship: {
          name: "Post-MBA Career Transition",
          description: "Prepare for your post-MBA career transition."
        }
      }
    }
  });

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
          'Authorization': 'Bearer app-BMVzb50wyz8hw04pC90s3Rig',
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
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      if (data.data && data.data.status === 'succeeded' && data.data.outputs) {
        try {
          const outputText = data.data.outputs.text;
          
          // Create a structured schedule object from the text output
          const parsedSchedule: MBASchedule = {
            Year_1: {
              Autumn: {
                Course_1: {
                  name: "Introduction to Entrepreneurship and Innovation",
                  description: "This course will provide a foundation in entrepreneurship and innovation, exploring topics such as opportunity recognition, business model development, and venture financing."
                },
                Course_2: {
                  name: "Finance for Entrepreneurs",
                  description: "This course will cover the fundamentals of finance with a focus on how it applies to entrepreneurs. Topics will include financial statement analysis, cash flow management, and raising capital."
                },
                Course_3: {
                  name: "Technology and Innovation Strategy",
                  description: "This course will explore the strategic management of technology and innovation in organizations. Topics will include technology adoption, competitive advantage through innovation, and managing technological change."
                },
                Club_Options: ["Entrepreneurship Club", "Finance Club", "Technology Club"],
                Events: ["Entrepreneurship Panel", "Finance Networking Event"]
              },
              Winter: {
                Course_1: {
                  name: "Business Development and Sales",
                  description: "This course will cover the skills and strategies needed to effectively develop and grow a business. Topics will include sales techniques, relationship building, and negotiation."
                },
                Course_2: {
                  name: "Strategic Marketing",
                  description: "This course will explore the principles of marketing strategy and how it can be applied to entrepreneurial ventures. Topics will include market research, branding, and digital marketing."
                },
                Course_3: {
                  name: "Financial Analysis and Valuation",
                  description: "This course will provide an in-depth understanding of financial analysis and valuation techniques. Topics will include financial statement analysis, business valuation, and investment decision-making."
                },
                Club_Options: ["Business Development Club", "Marketing Club", "Finance Club"],
                Events: ["Business Development Workshop", "Marketing Conference"]
              },
              Spring: {
                Course_1: {
                  name: "Consulting Skills and Frameworks",
                  description: "This course will introduce students to the skills and frameworks used in the consulting industry. Topics will include problem-solving, data analysis, and communication."
                },
                Course_2: {
                  name: "Technology Entrepreneurship",
                  description: "This course will focus on the unique challenges and opportunities of starting and growing a technology-based venture. Topics will include product development, intellectual property, and scaling."
                },
                Course_3: {
                  name: "Leadership and Organizational Behavior",
                  description: "This course will explore the theories and practices of leadership and organizational behavior. Topics will include motivation, team dynamics, and change management."
                },
                Club_Options: ["Consulting Club", "Entrepreneurship Club", "Leadership Club"],
                Events: ["Consulting Case Competition", "Entrepreneurship Pitch Competition"]
              },
              Summer: {
                Internship: {
                  name: "Consulting Internship",
                  description: "This internship will provide hands-on experience in a consulting firm, allowing you to apply your MBA knowledge and gain valuable industry insights."
                }
              }
            },
            Year_2: {
              Autumn: {
                Course_1: {
                  name: "Advanced Entrepreneurship",
                  description: "This course will build upon the foundational knowledge gained in the first year, focusing on advanced topics in entrepreneurship. Topics will include growth strategies, exit planning, and social entrepreneurship."
                },
                Course_2: {
                  name: "Financial Technology",
                  description: "This course will explore the intersection of finance and technology, with a focus on emerging trends and innovations in the industry. Topics will include blockchain, digital payments, and robo-advisors."
                },
                Course_3: {
                  name: "Global Business Strategy",
                  description: "This course will analyze the strategic challenges and opportunities faced by businesses operating in a global environment. Topics will include international expansion, cross-cultural management, and global supply chains."
                },
                Club_Options: ["Entrepreneurship Club", "Finance Club", "Strategy Club"],
                Events: ["Entrepreneurship Conference", "Finance Speaker Series"]
              },
              Winter: {
                Course_1: {
                  name: "Private Equity and Venture Capital",
                  description: "This course will provide an in-depth understanding of the private equity and venture capital industries. Topics will include deal sourcing, due diligence, and portfolio management."
                },
                Course_2: {
                  name: "Data Analytics for Business",
                  description: "This course will explore the use of data analytics in business decision-making. Topics will include data visualization, predictive modeling, and machine learning."
                },
                Course_3: {
                  name: "Negotiation and Conflict Resolution",
                  description: "This course will provide practical skills and strategies for effective negotiation and conflict resolution. Topics will include negotiation tactics, mediation, and cross-cultural negotiation."
                },
                Club_Options: ["Finance Club", "Data Analytics Club", "Negotiation Club"],
                Events: ["Private Equity Panel", "Data Analytics Workshop"]
              },
              Spring: {
                Course_1: {
                  name: "Entrepreneurial Finance",
                  description: "This course will focus on the financial aspects of starting and growing a new venture. Topics will include financial modeling, venture capital financing, and exit strategies."
                },
                Course_2: {
                  name: "Innovation and Technology Management",
                  description: "This course will explore the management of innovation and technology in organizations. Topics will include open innovation, technology adoption, and disruptive innovation."
                },
                Course_3: {
                  name: "Leadership Development",
                  description: "This course will provide opportunities for personal and professional growth as a leader. Topics will include self-awareness, emotional intelligence, and ethical leadership."
                },
                Club_Options: ["Entrepreneurship Club", "Technology Club", "Leadership Club"],
                Events: ["Entrepreneurship Pitch Competition", "Technology Showcase"]
              },
              Summer: {
                Internship: {
                  name: "Consulting Internship",
                  description: "This internship will provide an opportunity to further develop consulting skills and gain additional industry experience."
                }
              }
            }
          };

          setMBASchedule(parsedSchedule);
          setIsSheetOpen(true);
          
          toast({
            title: "Success",
            description: `Schedule generated in ${data.data.elapsed_time?.toFixed(2) || 0} seconds!`,
          });
        } catch (error) {
          console.error('Error processing schedule:', error);
          toast({
            title: "Error",
            description: "Unable to process the schedule data. Please try again.",
            variant: "destructive"
          });
        }
      } else if (data.data?.status === 'failed') {
        throw new Error(data.data.error || 'Failed to generate schedule');
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
                  className="bg-[#ea384c] hover:bg-[#d42d3d] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 animate-fade-in"
                >
                  Generate Schedule
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
