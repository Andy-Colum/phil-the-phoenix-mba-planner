
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, MessageSquare, ArrowRight } from "lucide-react";

const Index = () => {
  const [message, setMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartChat = () => {
    setChatStarted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented when we connect to the AI service
    console.log("Message submitted:", message);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Bar */}
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
          {/* Left Section */}
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

          {/* Middle Section */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
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
            </CardContent>
          </Card>

          {/* Right Section */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                Chat with Phil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Share your career goals and interests..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full"
                />
                <Button 
                  type="submit"
                  className="w-full bg-[#ea384c] hover:bg-[#d42d3d] text-white"
                >
                  <ArrowRight className="h-5 w-5" />
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
