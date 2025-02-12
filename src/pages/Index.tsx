import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Building
} from "lucide-react";

const Index = () => {
  const [message, setMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [programType, setProgramType] = useState("");
  const [focusArea, setFocusArea] = useState("");

  const handleStartChat = () => {
    setChatStarted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", { programType, focusArea, message });
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
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 text-center">
                Let Phil the Phoenix guide you through your personalized Booth MBA experience.
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={handleStartChat}
                  className="bg-[#ea384c] hover:bg-[#d42d3d] text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 animate-fade-in"
                >
                  Talk to Phil
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-gray-800">Why Choose Booth?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#ea384c]" />
                    World-renowned faculty and research
                  </li>
                  <li className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#ea384c]" />
                    Flexible curriculum tailored to your goals
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#ea384c]" />
                    Global network and opportunities
                  </li>
                </ul>
              </div>
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
                  <Select onValueChange={setProgramType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">
                        <span className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Full-Time MBA
                        </span>
                      </SelectItem>
                      <SelectItem value="evening">
                        <span className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Evening MBA
                        </span>
                      </SelectItem>
                      <SelectItem value="weekend">
                        <span className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Weekend MBA
                        </span>
                      </SelectItem>
                      <SelectItem value="executive">
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
                  <Select onValueChange={setFocusArea}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance">
                        <span className="flex items-center gap-2">
                          <ChartBar className="h-4 w-4" />
                          Finance
                        </span>
                      </SelectItem>
                      <SelectItem value="marketing">
                        <span className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Marketing
                        </span>
                      </SelectItem>
                      <SelectItem value="operations">
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Operations
                        </span>
                      </SelectItem>
                      <SelectItem value="strategy">
                        <span className="flex items-center gap-2">
                          <Rocket className="h-4 w-4" />
                          Strategy
                        </span>
                      </SelectItem>
                      <SelectItem value="leadership">
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Leadership & Management
                        </span>
                      </SelectItem>
                      <SelectItem value="business-environment">
                        <span className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Business Environment
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tell Phil more about your goals</label>
                  <Input
                    placeholder="Share your career goals and interests..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#ea384c] hover:bg-[#d42d3d] text-white font-semibold"
                >
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
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
