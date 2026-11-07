import { describe, expect, it } from 'vitest';
import { addMinutes, formatTime, parseTime } from './time';

describe('time', () => {
  it('parses 24-hour times', () => {
    expect(parseTime('09:41')).toBe(581);
    expect(parseTime('9.05')).toBe(545);
    expect(parseTime('24:00')).toBeNull();
    expect(parseTime('dün')).toBeNull();
  });

  it('formats for the mock language', () => {
    expect(formatTime('09:41', 'tr')).toBe('09:41');
    expect(formatTime('09:41', 'en')).toBe('9:41 AM');
    expect(formatTime('00:05', 'en')).toBe('12:05 AM');
    expect(formatTime('13:00', 'en')).toBe('1:00 PM');
    expect(formatTime('dün', 'tr')).toBe('dün');
  });

  it('adds minutes across midnight', () => {
    expect(addMinutes('23:59', 1)).toBe('00:00');
    expect(addMinutes('x', 1)).toBe('x');
  });
});
