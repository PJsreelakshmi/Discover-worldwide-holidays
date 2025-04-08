export interface Holiday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: number | null;
    types: string[];
  }
  
  export interface DayInfo {
    date: Date;
    isCurrentMonth: boolean;
    holiday?: Holiday;
  }