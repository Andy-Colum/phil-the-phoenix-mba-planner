
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowRight, BookOpen, Users, Calendar, Briefcase } from "lucide-react";
import { TermData, SummerData } from "@/types/mba";

interface TermBlockProps {
  data: TermData | SummerData;
  term: string;
}

export const TermBlock = ({ data, term }: TermBlockProps) => {
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
