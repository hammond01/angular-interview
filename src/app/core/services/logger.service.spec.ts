import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    });
    service = TestBed.inject(LoggerService);
    service.clearLogs();
  });

  describe('Logging Methods', () => {
    it('should log debug messages', () => {
      service.debug('Debug message', { key: 'value' });
      const logs = service.getLogs();

      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.DEBUG);
      expect(logs[0].message).toBe('Debug message');
      expect(logs[0].data).toEqual({ key: 'value' });
    });

    it('should log info messages', () => {
      service.info('Info message');
      const logs = service.getLogs();

      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.INFO);
      expect(logs[0].message).toBe('Info message');
    });

    it('should log warn messages', () => {
      service.warn('Warning message');
      const logs = service.getLogs();

      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.WARN);
    });

    it('should log error messages with Error object', () => {
      const error = new Error('Test error');
      service.error('Error occurred', error);
      const logs = service.getLogs();

      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].error).toBe(error);
    });

    it('should log error messages with string', () => {
      service.error('Error message', 'Additional info');
      const logs = service.getLogs();

      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].message).toBe('Error message: Additional info');
    });
  });

  describe('Log Level Filtering', () => {
    it('should respect log level settings', () => {
      service.setLogLevel(LogLevel.WARN);

      service.debug('Debug');
      service.info('Info');
      service.warn('Warn');
      service.error('Error');

      const logs = service.getLogs();
      expect(logs.length).toBe(2); // Only WARN and ERROR
      expect(logs[0].message).toBe('Warn');
      expect(logs[1].message).toBe('Error');
    });

    it('should log all messages at DEBUG level', () => {
      service.setLogLevel(LogLevel.DEBUG);

      service.debug('Debug');
      service.info('Info');
      service.warn('Warn');
      service.error('Error');

      expect(service.getLogs().length).toBe(4);
    });
  });

  describe('Log Management', () => {
    it('should clear all logs', () => {
      service.debug('Message 1');
      service.info('Message 2');

      expect(service.getLogs().length).toBe(2);

      service.clearLogs();
      expect(service.getLogs().length).toBe(0);
    });

    it('should export logs as JSON', () => {
      service.debug('Test message');
      const exported = service.exportLogs();

      expect(typeof exported).toBe('string');
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].message).toBe('Test message');
    });

    it('should maintain max logs limit', () => {
      // Add many logs
      for (let i = 0; i < 1010; i++) {
        service.info(`Message ${i}`);
      }

      const logs = service.getLogs();
      expect(logs.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Timestamp', () => {
    it('should include timestamp in log entry', () => {
      const beforeTime = new Date();
      service.info('Test');
      const afterTime = new Date();

      const logs = service.getLogs();
      expect(logs[0].timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeTime.getTime(),
      );
      expect(logs[0].timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });
});
