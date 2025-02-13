
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, Moon, Sun, Briefcase, ArrowRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MBASchedule } from "@/types/mba";

interface MBAFormProps {
  onScheduleGenerated: (schedule: MBASchedule) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export const MBAForm = ({ onScheduleGenerated, isGenerating, setIsGenerating }: MBAFormProps) => {
  const { toast } = useToast();
  const [MBA_Program_Type, setMBA_Program_Type] = useState("");
  const [MBA_Focus_Area, setMBA_Focus_Area] = useState("");
  const [Professional_Goals, setProfessional_Goals] = useState("");
  const [Extracurricular_Interests, setExtracurricular_Interests] = useState("");

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
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'DIFY_WORKFLOW_API_KEY')
        .single();

      if (secretError || !secretData) {
        throw new Error('Could not retrieve API key');
      }

      const response = await fetch('https://api.dify.ai/v1/workflows/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretData.value}`,
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
          const outputString = data.data.outputs.output;
          const cleanOutput = outputString.replace(/\/\/ Same structure as Year_1/g, '');
          let scheduleData = JSON.parse(cleanOutput);
          
          if (!scheduleData.Year_2 || Object.keys(scheduleData.Year_2).length === 0) {
            scheduleData.Year_2 = {
              ...scheduleData.Year_1,
              Autumn: {
                ...scheduleData.Year_1.Autumn,
                Course_1: { ...scheduleData.Year_1.Autumn.Course_1, description: "Advanced " + scheduleData.Year_1.Autumn.Course_1.description },
                Course_2: { ...scheduleData.Year_1.Autumn.Course_2, description: "Advanced " + scheduleData.Year_1.Autumn.Course_2.description },
                Course_3: { ...scheduleData.Year_1.Autumn.Course_3, description: "Advanced " + scheduleData.Year_1.Autumn.Course_3.description }
              },
              Winter: {
                ...scheduleData.Year_1.Winter,
                Course_1: { ...scheduleData.Year_1.Winter.Course_1, description: "Advanced " + scheduleData.Year_1.Winter.Course_1.description },
                Course_2: { ...scheduleData.Year_1.Winter.Course_2, description: "Advanced " + scheduleData.Year_1.Winter.Course_2.description },
                Course_3: { ...scheduleData.Year_1.Winter.Course_3, description: "Advanced " + scheduleData.Year_1.Winter.Course_3.description }
              },
              Spring: {
                ...scheduleData.Year_1.Spring,
                Course_1: { ...scheduleData.Year_1.Spring.Course_1, description: "Advanced " + scheduleData.Year_1.Spring.Course_1.description },
                Course_2: { ...scheduleData.Year_1.Spring.Course_2, description: "Advanced " + scheduleData.Year_1.Spring.Course_2.description },
                Course_3: { ...scheduleData.Year_1.Spring.Course_3, description: "Advanced " + scheduleData.Year_1.Spring.Course_3.description }
              },
              Summer: {
                Internship: {
                  name: "Final Summer Internship",
                  description: "Apply your MBA knowledge in a real-world setting with a focus on your career goals."
                }
              }
            };
          }

          onScheduleGenerated(scheduleData);
          
          toast({
            title: "Success",
            description: "Your MBA schedule has been generated successfully!",
          });
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

  return (
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
                <Briefcase className="h-4 w-4" />
                Finance & Accounting
              </span>
            </SelectItem>
            <SelectItem value="Entrepreneurship_Innovation">
              <span className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Entrepreneurship & Innovation
              </span>
            </SelectItem>
            <SelectItem value="Marketing_Strategy">
              <span className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Marketing & Strategy
              </span>
            </SelectItem>
            <SelectItem value="Data_Analytics_Tech">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Data Analytics & Tech
              </span>
            </SelectItem>
            <SelectItem value="International_Business">
              <span className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                International Business
              </span>
            </SelectItem>
            <SelectItem value="Public_Policy_Impact">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Public Policy & Impact
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Step 3: Professional Goals</label>
        <Input
          value={Professional_Goals}
          onChange={(e) => setProfessional_Goals(e.target.value)}
          placeholder="What are your career aspirations?"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Step 4: Extracurricular Interests</label>
        <Input
          value={Extracurricular_Interests}
          onChange={(e) => setExtracurricular_Interests(e.target.value)}
          placeholder="What activities interest you?"
        />
      </div>

      <Button 
        type="submit"
        className="w-full bg-[#ea384c] hover:bg-[#d42d3d] text-white"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin">⌛</span>
            Generating Your MBA Journey...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            Generate Your MBA Journey
            <ArrowRight className="h-5 w-5" />
          </div>
        )}
      </Button>
    </form>
  );
};
