const { GoogleCalendarClient } = require('../gcal-integration/dist');

// Mock the googleapis module
jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        OAuth2: jest.fn().mockImplementation(() => ({
          generateAuthUrl: jest.fn().mockReturnValue('https://mock-auth-url.com'),
          getToken: jest.fn().mockResolvedValue({ tokens: { refresh_token: 'mock-refresh-token' } }),
          setCredentials: jest.fn()
        }))
      },
      calendar: jest.fn().mockImplementation(() => ({
        events: {
          list: jest.fn().mockResolvedValue({
            data: {
              items: []
            }
          }),
          insert: jest.fn().mockResolvedValue({
            data: {
              id: 'mock-event-id',
              htmlLink: 'https://mock-event-link.com'
            }
          })
        }
      }))
    }
  };
});

describe('Google Calendar Integration', () => {
  let calendarClient;

  beforeEach(() => {
    calendarClient = new GoogleCalendarClient({
      clientId: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      redirectUri: 'http://localhost:3000/callback'
    });
  });

  test('getAuthUrl should generate OAuth URL', () => {
    const authUrl = calendarClient.getAuthUrl();
    expect(authUrl).toBe('https://mock-auth-url.com');
  });

  test('getTokens should exchange code for tokens', async () => {
    const tokens = await calendarClient.getTokens('mock-code');
    expect(tokens).toEqual({ refresh_token: 'mock-refresh-token' });
  });

  test('checkAvailability should return true when calendar is available', async () => {
    // Create a date for tomorrow to avoid current day restriction
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isAvailable = await calendarClient.checkAvailability(
      tomorrow,
      '12:00',
      '14:00'
    );
    
    expect(isAvailable).toBe(true);
  });

  test('addShiftEvent should create calendar event', async () => {
    // Create a date for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const eventId = await calendarClient.addShiftEvent(
      'H11A',
      tomorrow,
      '12:00',
      '14:00',
      'Test Location'
    );
    
    expect(eventId).toBe('mock-event-id');
  });
});