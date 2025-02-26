const { ChatGPTClient } = require('../chatgpt-api/dist');

// Mock the OpenAI module
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    classCode: 'H11A',
                    date: 'Thursday',
                    timeRange: {
                      start: '12:00',
                      end: '14:00'
                    },
                    component: 'lab',
                    location: null
                  })
                }
              }
            ]
          })
        }
      }
    };
  });
});

describe('ChatGPT API Integration', () => {
  let gptClient;

  beforeEach(() => {
    gptClient = new ChatGPTClient({
      apiKey: 'mock-api-key'
    });
  });

  test('analyzeShiftRequest should parse messages correctly', async () => {
    const result = await gptClient.analyzeShiftRequest(
      'Hello, would anyone like to take my lab tomorrow (Thursday) from 12-2pm?'
    );
    
    expect(result).not.toBeNull();
    if (result) {
      expect(result.className).toBe('H11A');
      expect(result.isLabOnly).toBe(true);
      expect(result.startTime).toBe('12:00');
      expect(result.endTime).toBe('14:00');
    }
  });
});