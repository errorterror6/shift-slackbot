import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

export interface CalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
}

export class GoogleCalendarClient {
  private calendar: calendar_v3.Calendar;
  private auth: OAuth2Client;
  private config: CalendarConfig;
  
  constructor(config: CalendarConfig) {
    this.config = config;
    
    this.auth = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
    
    if (config.refreshToken) {
      this.auth.setCredentials({
        refresh_token: config.refreshToken
      });
    }
    
    this.calendar = google.calendar({
      version: 'v3',
      auth: this.auth
    });
  }
  
  /**
   * Generate the URL for the OAuth2 consent screen
   */
  public getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];
    
    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }
  
  /**
   * Exchange authorization code for tokens
   */
  public async getTokens(code: string): Promise<any> {
    const { tokens } = await this.auth.getToken(code);
    this.auth.setCredentials(tokens);
    return tokens;
  }
  
  /**
   * Set refresh token
   */
  public setRefreshToken(refreshToken: string): void {
    this.auth.setCredentials({
      refresh_token: refreshToken
    });
    
    this.config.refreshToken = refreshToken;
  }
  
  /**
   * Check if user is available during the specified time range
   */
  public async checkAvailability(date: Date, startTime: string, endTime: string): Promise<boolean> {
    try {
      // Create start and end date objects
      const startDate = new Date(date);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);
      
      const endDate = new Date(date);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      endDate.setHours(endHour, endMinute, 0, 0);
      
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Don't automatically accept shifts for the current day
      if (date.getTime() === today.getTime()) {
        console.log('Not accepting shifts for the current day');
        return false;
      }
      
      // Check if we have events during this time
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
      });
      
      // If any events are found, the user is not available
      return (response.data.items?.length || 0) === 0;
    } catch (error) {
      console.error('Error checking calendar availability:', error);
      return false;
    }
  }
  
  /**
   * Add a shift event to the calendar
   */
  public async addShiftEvent(
    className: string,
    date: Date,
    startTime: string,
    endTime: string,
    location: string
  ): Promise<string | null> {
    try {
      // Create start and end date objects
      const startDate = new Date(date);
      const [startHour, startMinute] = startTime.split(':').map(Number);
      startDate.setHours(startHour, startMinute, 0, 0);
      
      const endDate = new Date(date);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      endDate.setHours(endHour, endMinute, 0, 0);
      
      // Create the event
      const event = {
        summary: `${className}`,
        location,
        description: `Shift coverage for ${className}`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: true,
        },
      };
      
      // Insert the event
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });
      
      console.log(`Event created: ${response.data.htmlLink}`);
      return response.data.id || null;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      return null;
    }
  }
  
  /**
   * List upcoming events
   */
  public async listUpcomingEvents(maxResults: number = 10): Promise<calendar_v3.Schema$Event[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });
      
      return response.data.items || [];
    } catch (error) {
      console.error('Error listing upcoming events:', error);
      return [];
    }
  }
}

export default GoogleCalendarClient;