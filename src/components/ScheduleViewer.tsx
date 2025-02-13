
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TermBlock } from "@/components/TermBlock";
import { jsPDF } from "jspdf";
import { MBASchedule } from "@/types/mba";

interface ScheduleViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: MBASchedule;
  formData: {
    MBA_Program_Type: string;
    MBA_Focus_Area: string;
    Professional_Goals: string;
    Extracurricular_Interests: string;
  };
}

export const ScheduleViewer = ({ isOpen, onOpenChange, schedule, formData }: ScheduleViewerProps) => {
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
    doc.text(`Program Type: ${formData.MBA_Program_Type.replace(/_/g, ' ')}`, 10 + indent, yOffset);
    yOffset += lineHeight;
    doc.text(`Focus Area: ${formData.MBA_Focus_Area.replace(/_/g, ' ')}`, 10 + indent, yOffset);
    yOffset += lineHeight;
    doc.text(`Professional Goals: ${formData.Professional_Goals}`, 10 + indent, yOffset);
    yOffset += lineHeight;
    doc.text(`Extracurricular Interests: ${formData.Extracurricular_Interests}`, 10 + indent, yOffset);
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
    const addTermDetails = (term: any, termName: string, startY: number, isSummer: boolean = false) => {
      let y = startY;
      
      doc.setFontSize(12);
      doc.text(termName, 10, y);
      y += lineHeight;
      
      doc.setFontSize(10);
      if (!isSummer) {
        // Courses
        doc.text("Courses:", 10 + indent, y);
        y += lineHeight;
        
        ['Course_1', 'Course_2', 'Course_3'].forEach((courseKey) => {
          const course = term[courseKey];
          doc.text(`• ${course.name}`, 10 + indent * 2, y);
          y += lineHeight;
          y = addWrappedText(course.description, 10 + indent * 3, y, 180) + lineHeight;
        });

        // Clubs
        doc.text("Club Options:", 10 + indent, y);
        y += lineHeight;
        term.Club_Options.forEach((club: string) => {
          doc.text(`• ${club}`, 10 + indent * 2, y);
          y += lineHeight;
        });

        // Events
        doc.text("Events:", 10 + indent, y);
        y += lineHeight;
        term.Events.forEach((event: string) => {
          doc.text(`• ${event}`, 10 + indent * 2, y);
          y += lineHeight;
        });
      } else {
        doc.text("Internship:", 10 + indent, y);
        y += lineHeight;
        doc.text(`• ${term.Internship.name}`, 10 + indent * 2, y);
        y += lineHeight;
        y = addWrappedText(term.Internship.description, 10 + indent * 3, y, 180) + lineHeight;
      }
      
      return y + lineHeight;
    };

    // Year 1
    doc.setFontSize(14);
    doc.text("Year 1", 10, yOffset);
    yOffset += lineHeight * 1.5;

    ['Autumn', 'Winter', 'Spring'].forEach(term => {
      yOffset = addTermDetails(schedule.Year_1[term], `${term} Quarter`, yOffset);
      
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 10;
      }
    });
    
    yOffset = addTermDetails(schedule.Year_1.Summer, "Summer", yOffset, true);

    // Year 2
    doc.addPage();
    yOffset = 10;
    doc.setFontSize(14);
    doc.text("Year 2", 10, yOffset);
    yOffset += lineHeight * 1.5;

    ['Autumn', 'Winter', 'Spring'].forEach(term => {
      yOffset = addTermDetails(schedule.Year_2[term], `${term} Quarter`, yOffset);
      
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 10;
      }
    });
    
    yOffset = addTermDetails(schedule.Year_2.Summer, "Summer", yOffset, true);

    // Save the PDF
    doc.save('booth-mba-schedule.pdf');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
              <TermBlock data={schedule.Year_1.Autumn} term="Autumn" />
              <TermBlock data={schedule.Year_1.Winter} term="Winter" />
              <TermBlock data={schedule.Year_1.Spring} term="Spring" />
              <TermBlock data={schedule.Year_1.Summer} term="Summer" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Year 2</h3>
            <div className="space-y-4">
              <TermBlock data={schedule.Year_2.Autumn} term="Autumn" />
              <TermBlock data={schedule.Year_2.Winter} term="Winter" />
              <TermBlock data={schedule.Year_2.Spring} term="Spring" />
              <TermBlock data={schedule.Year_2.Summer} term="Summer" />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
