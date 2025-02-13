
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Calendar, BookOpen, Users } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

interface MBAJourneyProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: MBASchedule;
}

const TermBlock = ({ data, term }: { data: TermData | SummerData; term: string }) => {
  const isSummer = term === "Summer";

  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <h4 className="font-medium text-lg">{term}</h4>
          <Calendar className="h-5 w-5" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-4 bg-gray-50 rounded-lg mt-2">
        {!isSummer ? (
          <>
            <div className="space-y-3">
              <h5 className="font-medium text-gray-700">Courses</h5>
              {Object.entries((data as TermData))
                .filter(([key]) => key.startsWith('Course'))
                .map(([key, course]) => {
                  const typedCourse = course as CourseData;
                  return (
                    <div key={typedCourse.name} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#ea384c]" />
                        <h6 className="font-medium">{typedCourse.name}</h6>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-6">{typedCourse.description}</p>
                    </div>
                  );
                })}
            </div>
            <div>
              <h5 className="font-medium text-gray-700">Clubs</h5>
              <div className="mt-2 space-y-2">
                {(data as TermData).Club_Options.map((club, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{club}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-700">Events</h5>
              <div className="mt-2 space-y-2">
                {(data as TermData).Events.map((event, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h5 className="font-medium text-gray-700 mb-2">Summer Internship</h5>
            <div className="ml-2">
              <h6 className="font-medium">{(data as SummerData).Internship.name}</h6>
              <p className="text-sm text-gray-600 mt-1">{(data as SummerData).Internship.description}</p>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export const MBAJourney: React.FC<MBAJourneyProps> = ({ isOpen, onOpenChange, schedule }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="w-[90%] sm:w-[540px] h-[80vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Two-Year MBA Journey at Booth
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Year 1</h3>
            <div className="space-y-4">
              <TermBlock data={schedule.Year_1.Autumn} term="Autumn Quarter" />
              <TermBlock data={schedule.Year_1.Winter} term="Winter Quarter" />
              <TermBlock data={schedule.Year_1.Spring} term="Spring Quarter" />
              <TermBlock data={schedule.Year_1.Summer} term="Summer" />
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-xl font-semibold mb-4">Year 2</h3>
            <div className="space-y-4">
              <TermBlock data={schedule.Year_2.Autumn} term="Autumn Quarter" />
              <TermBlock data={schedule.Year_2.Winter} term="Winter Quarter" />
              <TermBlock data={schedule.Year_2.Spring} term="Spring Quarter" />
              <TermBlock data={schedule.Year_2.Summer} term="Summer" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
