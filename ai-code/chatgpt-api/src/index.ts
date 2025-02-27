import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ShiftRequest } from '../../slack-api/src/messageProcessor';

dotenv.config();

export interface ChatGPTConfig {
  apiKey: string;
  modelName?: string;
}

export class ChatGPTClient {
  private openai: OpenAI;
  private modelName: string;
  private classDataCache: any = null;
  
  constructor(config: ChatGPTConfig) {
    this.openai = new OpenAI({
      apiKey: config.apiKey,
    });
    
    this.modelName = config.modelName || 'gpt-3.5-turbo';
    this.loadClassData();
  }
  
  /**
   * Load the class data from a JSON file
   */
  private loadClassData(): void {
    try {
      // This would load the class timetable data from a JSON file
      // For this demo, we'll hard-code some sample data
      this.classDataCache = {
        "H11A": {
          day: "Thursday",
          tutorial: {
            startTime: "11:00",
            endTime: "12:00",
            room: "H13 Lawrence East 1040"
          },
          lab: {
            startTime: "12:00",
            endTime: "14:00",
            room: "tabla"
          }
        },
        "W11A": {
          day: "Wednesday",
          tutorial: {
            startTime: "11:00",
            endTime: "12:00",
            room: "Quadrangle G031"
          },
          lab: {
            startTime: "12:00",
            endTime: "14:00",
            room: "tabla"
          }
        },
        "M16B": {
          day: "Monday",
          tutorial: {
            startTime: "16:00",
            endTime: "17:00",
            room: "Goldstein G05"
          },
          lab: {
            startTime: "17:00",
            endTime: "19:00",
            room: "bongo"
          }
        },
        "H13A": {
          day: "Thursday",
          tutorial: {
            startTime: "13:00",
            endTime: "14:00",
            room: "Law Building 276"
          },
          lab: {
            startTime: "14:00",
            endTime: "16:00",
            room: "bongo"
          }
        }
      };
    } catch (error) {
      console.error('Error loading class data:', error);
    }
  }
  
  /**
   * Parse a Slack message to identify shift request details
   */
  public async analyzeShiftRequest(message: string): Promise<ShiftRequest | null> {
    try {
      // For a real implementation, this would invoke the C++ module
      // For this demo, we'll simulate it with an API call to OpenAI
      
      const prompt = `
      Parse the following message to identify a shift request. Extract the following information:
      1. Class code (e.g., H11A, M16B)
      2. Date of the shift (specific date or day)
      3. Time range (start and end times)
      4. Whether it's a lab only, tutorial only, or both
      5. Any location information
      
      Message: "${message}"
      
      Respond in JSON format with the following structure:
      {
        "classCode": "X00X",
        "date": "YYYY-MM-DD" or "dayName",
        "timeRange": {
          "start": "HH:MM",
          "end": "HH:MM"
        },
        "component": "lab" | "tutorial" | "both",
        "location": "roomInfo if available"
      }
      
      If this doesn't appear to be a shift request, respond with null.
      `;
      
      const response = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: [
          { role: 'system', content: 'You are a shift request analyzer.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
      });
      
      const content = response.choices[0]?.message?.content?.trim();
      
      if (!content || content === 'null') {
        return null;
      }
      
      try {
        const parsedData = JSON.parse(content);
        
        if (!parsedData || !parsedData.classCode) {
          return null;
        }
        
        // Process the parsed data into a ShiftRequest object
        const classCode = parsedData.classCode;
        
        // Get class data from our cache
        const classData = this.classDataCache[classCode];
        
        if (!classData) {
          console.warn(`No class data found for ${classCode}`);
          return null;
        }
        
        // Determine the date
        let date: Date;
        if (parsedData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          date = new Date(parsedData.date);
        } else {
          // Handle day names by finding the next occurrence of that day
          const dayName = parsedData.date;
          const today = new Date();
          const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            .findIndex(day => day.toLowerCase() === dayName.toLowerCase());
          
          if (dayIndex === -1) {
            console.warn(`Invalid day name: ${dayName}`);
            return null;
          }
          
          date = new Date();
          const currentDay = date.getDay();
          const daysToAdd = (dayIndex - currentDay + 7) % 7;
          date.setDate(date.getDate() + daysToAdd);
        }
        
        // Determine times based on component
        let startTime: string, endTime: string;
        if (parsedData.component === 'lab') {
          startTime = classData.lab.startTime;
          endTime = classData.lab.endTime;
        } else if (parsedData.component === 'tutorial') {
          startTime = classData.tutorial.startTime;
          endTime = classData.tutorial.endTime;
        } else {
          // Both tutorial and lab
          startTime = classData.tutorial.startTime;
          endTime = classData.lab.endTime;
        }
        
        // Use provided times if available
        if (parsedData.timeRange && parsedData.timeRange.start && parsedData.timeRange.end) {
          startTime = parsedData.timeRange.start;
          endTime = parsedData.timeRange.end;
        }
        
        // Determine location
        let location = '';
        if (parsedData.component === 'lab') {
          location = `CSE Lab ${classData.lab.room} Lab`;
        } else if (parsedData.component === 'tutorial') {
          location = classData.tutorial.room;
        } else {
          location = `${classData.tutorial.room} + ${classData.lab.room}`;
        }
        
        if (parsedData.location) {
          location = parsedData.location;
        }
        
        return {
          className: classCode,
          date,
          startTime,
          endTime,
          location,
          isLabOnly: parsedData.component === 'lab',
          isTutorialOnly: parsedData.component === 'tutorial',
          isTutorialAndLab: parsedData.component === 'both',
          request: message
        };
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error analyzing shift request:', error);
      return null;
    }
  }
  
  /**
   * C++ Integration wrapper (placeholder)
   * In a real implementation, this would call the C++ module via Node.js addon
   */
  private async invokeCppModule(text: string): Promise<any> {
    // This is a placeholder for the C++ integration
    // In a real implementation, this would use a native addon to call C++ code
    console.log('C++ module would be called here with:', text);
    return null;
  }
}

export default ChatGPTClient;