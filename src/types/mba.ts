
export type CourseData = {
  name: string;
  description: string;
};

export type TermData = {
  Course_1: CourseData;
  Course_2: CourseData;
  Course_3: CourseData;
  Club_Options: string[];
  Events: string[];
};

export type SummerData = {
  Internship: {
    name: string;
    description: string;
  };
};

export type YearData = {
  Autumn: TermData;
  Winter: TermData;
  Spring: TermData;
  Summer: SummerData;
};

export type MBASchedule = {
  Year_1: YearData;
  Year_2: YearData;
};

export const defaultMBASchedule: MBASchedule = {
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
