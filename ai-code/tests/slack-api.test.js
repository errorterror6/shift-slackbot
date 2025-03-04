const { processShiftMessage, parseShiftCode, extractDateFromText, extractTimeRange } = require('../slack-api/dist/messageProcessor');

describe('Slack API Message Processor', () => {
  test('parseShiftCode should correctly parse class codes', () => {
    // Test parsing of H11A
    const result1 = parseShiftCode('H11A');
    expect(result1).toEqual({
      day: 'Thursday',
      hour: 11,
      code: 'A'
    });

    // Test parsing of M16B
    const result2 = parseShiftCode('M16B');
    expect(result2).toEqual({
      day: 'Monday',
      hour: 16,
      code: 'B'
    });

    // Test invalid code
    const result3 = parseShiftCode('XYZ');
    expect(result3).toBeNull();
  });

  test('extractTimeRange should correctly parse time ranges', () => {
    // Test format "12-2pm"
    const result1 = extractTimeRange('Can anyone cover 12-2pm?');
    expect(result1).toEqual({
      start: '12:00',
      end: '14:00'
    });

    // Test format "from 9:00 to 11:00"
    const result2 = extractTimeRange('from 9:00 to 11:00');
    expect(result2).toEqual({
      start: '09:00',
      end: '11:00'
    });

    // Test no time range
    const result3 = extractTimeRange('No time range here');
    expect(result3).toBeNull();
  });

  test('processShiftMessage should identify shift requests', () => {
    // This is a simplified test since full implementation would require more mocking
    const result = processShiftMessage('Can anyone take H11A tomorrow from 12-2pm?');
    
    // Since the actual implementation would need the date, we'll just check if it found the class code
    expect(result).not.toBeNull();
    if (result) {
      expect(result.className).toBe('H11A');
    }
  });
});