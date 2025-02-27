export interface ShiftRequest {
  className: string;  // e.g., "H11A"
  date: Date;         // Date of the shift
  startTime: string;  // e.g., "12:00"
  endTime: string;    // e.g., "14:00"
  location: string;   // e.g., "Quadrangle G031 + tabla"
  isLabOnly: boolean; // Whether this is just the lab portion
  isTutorialOnly: boolean; // Whether this is just the tutorial portion
  isTutorialAndLab: boolean; // Whether this is both tutorial and lab
  request: string;    // Original request text
}

// Helper function to parse shift code (e.g., "H11A" to day, time)
export function parseShiftCode(shiftCode: string): { day: string; hour: number; code: string } | null {
  // Regex to match the shift code format: letter + number + letter
  const match = shiftCode.match(/^([MTWRHF])(\d{2})([A-Z])$/i);
  
  if (!match) {
    return null;
  }
  
  const [_, dayCode, hourStr, classCode] = match;
  
  // Map day codes to full day names
  const dayMap: { [key: string]: string } = {
    'M': 'Monday',
    'T': 'Tuesday',
    'W': 'Wednesday',
    'R': 'Thursday', // 'H' in the specs, but academically 'R' is often used for Thursday
    'H': 'Thursday',
    'F': 'Friday'
  };
  
  const day = dayMap[dayCode.toUpperCase()];
  const hour = parseInt(hourStr, 10);
  
  return {
    day,
    hour,
    code: classCode
  };
}

// Function to extract date from text references like "tomorrow", "next Tuesday", etc.
export function extractDateFromText(text: string, referenceDate: Date = new Date()): Date | null {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  
  // Check for "tomorrow"
  if (text.toLowerCase().includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  // Check for day names
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  for (const [index, dayName] of dayNames.entries()) {
    if (text.toLowerCase().includes(dayName)) {
      const targetDate = new Date(today);
      const currentDay = today.getDay();
      const daysToAdd = (index - currentDay + 7) % 7;
      
      // If the day is today, assume they mean next week
      const additionalOffset = daysToAdd === 0 ? 7 : 0;
      
      // Check if it's "next <day>"
      const nextOffset = text.toLowerCase().includes(`next ${dayName}`) ? 7 : 0;
      
      targetDate.setDate(targetDate.getDate() + daysToAdd + additionalOffset + nextOffset);
      return targetDate;
    }
  }
  
  // Check for specific date formats (e.g., "26th Feb")
  const dateRegex = /(\d{1,2})(st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;
  const match = text.match(dateRegex);
  
  if (match) {
    const day = parseInt(match[1], 10);
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const month = monthNames.findIndex(m => m === match[3].toLowerCase());
    
    if (month !== -1) {
      const date = new Date(today);
      date.setMonth(month);
      date.setDate(day);
      
      // If the resulting date is in the past, assume next year
      if (date < today) {
        date.setFullYear(date.getFullYear() + 1);
      }
      
      return date;
    }
  }
  
  return null;
}

// Function to extract time ranges from text (e.g., "12-2pm", "from 12:00 to 14:00")
export function extractTimeRange(text: string): { start: string; end: string } | null {
  // Pattern for "X-Ypm" or "X-Y pm" format
  const simpleRangeRegex = /(\d{1,2})(?::(\d{2}))?(?:\s*-\s*)(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?/i;
  
  // Pattern for "from X to Y" format
  const fromToRangeRegex = /from\s+(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?\s+to\s+(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?/i;
  
  let match = text.match(simpleRangeRegex);
  
  if (match) {
    const startHour = parseInt(match[1], 10);
    const startMinute = match[2] ? parseInt(match[2], 10) : 0;
    const endHour = parseInt(match[3], 10);
    const endMinute = match[4] ? parseInt(match[4], 10) : 0;
    const period = match[5]?.toLowerCase();
    
    // Adjust for 12-hour clock if am/pm is specified
    let adjustedStartHour = startHour;
    let adjustedEndHour = endHour;
    
    if (period === 'pm' && startHour < 12) {
      adjustedStartHour += 12;
    }
    
    if (period === 'pm' && endHour < 12) {
      adjustedEndHour += 12;
    }
    
    const startTime = `${adjustedStartHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const endTime = `${adjustedEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return { start: startTime, end: endTime };
  }
  
  match = text.match(fromToRangeRegex);
  
  if (match) {
    const startHour = parseInt(match[1], 10);
    const startMinute = match[2] ? parseInt(match[2], 10) : 0;
    const startPeriod = match[3]?.toLowerCase();
    const endHour = parseInt(match[4], 10);
    const endMinute = match[5] ? parseInt(match[5], 10) : 0;
    const endPeriod = match[6]?.toLowerCase();
    
    // Adjust for 12-hour clock if am/pm is specified
    let adjustedStartHour = startHour;
    let adjustedEndHour = endHour;
    
    if (startPeriod === 'pm' && startHour < 12) {
      adjustedStartHour += 12;
    }
    
    if (endPeriod === 'pm' && endHour < 12) {
      adjustedEndHour += 12;
    }
    
    const startTime = `${adjustedStartHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const endTime = `${adjustedEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    return { start: startTime, end: endTime };
  }
  
  return null;
}

// Process messages to identify shift requests
export function processShiftMessage(message: string): ShiftRequest | null {
  // Look for class codes (e.g., "H11A", "M16B")
  const classCodeRegex = /[MTWRHF]\d{2}[A-Z]/g;
  const classCodes = message.match(classCodeRegex);
  
  if (!classCodes || classCodes.length === 0) {
    return null;
  }
  
  // Use the first class code found
  const classCode = classCodes[0];
  const parsedCode = parseShiftCode(classCode);
  
  if (!parsedCode) {
    return null;
  }
  
  // Extract the date
  const date = extractDateFromText(message);
  
  if (!date) {
    return null;
  }
  
  // Extract time range
  const timeRange = extractTimeRange(message);
  
  if (!timeRange) {
    return null;
  }
  
  // Determine if it's just lab, just tutorial, or both
  const isLabOnly = /\blab\b/i.test(message) && !/\btutorial\b/i.test(message) && !/\btut\b/i.test(message);
  const isTutorialOnly = (/\btutorial\b/i.test(message) || /\btut\b/i.test(message)) && !/\blab\b/i.test(message);
  const isTutorialAndLab = (/\btutorial\b/i.test(message) || /\btut\b/i.test(message)) && /\blab\b/i.test(message);
  
  // Determine location based on class code
  // For simplicity, we'll use placeholder values that would be replaced with a real lookup
  const location = `${classCode} - Room TBD + ${classCode.includes('bongo') ? 'bongo' : 'tabla'}`;
  
  return {
    className: classCode,
    date,
    startTime: timeRange.start,
    endTime: timeRange.end,
    location,
    isLabOnly,
    isTutorialOnly,
    isTutorialAndLab,
    request: message
  };
}