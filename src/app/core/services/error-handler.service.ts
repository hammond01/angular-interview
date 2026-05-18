import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';

export interface AppError {
  message: string;
  statusCode?: number;
  timestamp: Date;
  context?: string;
  details?: unknown;
}

/**
 * Global error handler service for the application.
 * Catches unhandled errors and logs them appropriately.
 *
 * To use this in your app, add it to providers:
 * ```typescript
 * providers: [
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler }
 * ]
 * ```
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger: LoggerService;
  private router: Router;

  constructor(injector: Injector) {
    // Use injector to avoid circular dependency with logger
    this.logger = injector.get(LoggerService);
    this.router = injector.get(Router);
  }

  handleError(error: unknown): void {
    const appError = this.normalizeError(error);

    // Log the error
    this.logger.error(appError.message, error, {
      statusCode: appError.statusCode,
      context: appError.context,
      details: appError.details,
    });

    // Handle specific error types
    this.handleErrorType(appError);

    // Show user-friendly message
    this.notifyUser(appError);
  }

  private normalizeError(error: unknown): AppError {
    const appError: AppError = {
      message: 'An unexpected error occurred',
      timestamp: new Date(),
    };

    if (error instanceof Error) {
      appError.message = error.message;
      appError.details = error.stack;
    } else if (typeof error === 'string') {
      appError.message = error;
    } else if (error && typeof error === 'object') {
      const errorObject = error as Record<string, unknown>;

      // Handle HTTP errors, custom errors, etc.
      if (typeof errorObject['status'] === 'number') {
        const status = errorObject['status'];
        const message = errorObject['message'];

        appError.statusCode = status;
        appError.message = typeof message === 'string' ? message : `HTTP Error ${status}`;
        appError.details = errorObject['error'];
      } else if (typeof errorObject['message'] === 'string') {
        appError.message = errorObject['message'];
        appError.details = errorObject;
      } else {
        appError.details = errorObject;
      }
    }

    return appError;
  }

  private handleErrorType(error: AppError): void {
    // Handle specific status codes
    switch (error.statusCode) {
      case 404:
        error.context = 'Resource not found';
        break;
      case 401:
        error.context = 'Unauthorized - please login';
        this.navigateToLogin();
        break;
      case 403:
        error.context = 'Access forbidden';
        break;
      case 500:
        error.context = 'Server error - please try again later';
        break;
      default:
        // Check error message for common patterns
        if (error.message.includes('timeout')) {
          error.context = 'Request timeout - please check your connection';
        } else if (error.message.includes('network')) {
          error.context = 'Network error - please check your internet connection';
        }
    }
  }

  private notifyUser(error: AppError): void {
    // TODO: Implement toast/snackbar notification
    // Example:
    // this.snackBar.open(error.message, 'Close', { duration: 5000 });

    // For now, publish a warning log entry until toast/snackbar is added.
    this.logger.warn(`User notification: ${error.message}`);
  }

  private navigateToLogin(): void {
    // TODO: Navigate to login page when unauthorized
    // this.router.navigate(['/login']);
  }
}
