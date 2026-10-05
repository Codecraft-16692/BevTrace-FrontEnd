import { signal } from '@angular/core';
import { Observable, retry } from 'rxjs';

import { AppMessage } from '../domain/model/app-message';
import { BusinessError } from '../domain/model/business-error';

/**
 * Abstract base class for the signal-based application stores of BevTrace.
 *
 * @remarks
 * Provides the loading, error and success signals shared by every bounded
 * context store, together with helpers that wrap the subscription boilerplate
 * of read and write operations. Business rule violations raised as
 * BusinessError are exposed to the views with their own translation key.
 */
export abstract class BaseStore {
  /**
   * Internal signal indicating whether an API operation is running.
   */
  private readonly _isLoading = signal<boolean>(false);

  /**
   * Internal signal containing the latest error message, if any.
   */
  private readonly _error = signal<AppMessage | null>(null);

  /**
   * Internal signal containing the latest success message, if any.
   */
  private readonly _successMsg = signal<AppMessage | null>(null);

  /**
   * Readonly signal exposing the loading state.
   */
  readonly isLoading = this._isLoading.asReadonly();

  /**
   * Readonly signal exposing the latest error message.
   */
  readonly error = this._error.asReadonly();

  /**
   * Readonly signal exposing the latest success message.
   */
  readonly successMsg = this._successMsg.asReadonly();

  /**
   * Clears active user-facing messages from the store.
   */
  clearMessages(): void {
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Executes a read operation and stores its result through the given callback.
   *
   * @param operation - Observable performing the HTTP request
   * @param errorKey - Translation key used when the operation fails
   * @param onSuccess - Callback receiving the result
   */
  protected read<T>(
    operation: Observable<T>,
    errorKey: string,
    onSuccess: (result: T) => void,
  ): void {
    this.startOperation();
    operation.pipe(retry(1)).subscribe({
      next: (result) => {
        onSuccess(result);
        this.finishOperation();
      },
      error: (error: unknown) => this.failOperation(error, errorKey),
    });
  }

  /**
   * Executes a write operation and publishes a success message when it completes.
   *
   * @param operation - Observable performing the HTTP requests
   * @param errorKey - Translation key used when the operation fails
   * @param onSuccess - Callback receiving the result
   * @param successMessage - Optional success message shown to the user
   */
  protected write<T>(
    operation: Observable<T>,
    errorKey: string,
    onSuccess: (result: T) => void,
    successMessage?: AppMessage,
  ): void {
    this.startOperation();
    operation.subscribe({
      next: (result) => {
        onSuccess(result);
        if (successMessage) this._successMsg.set(successMessage);
        this.finishOperation();
      },
      error: (error: unknown) => this.failOperation(error, errorKey),
    });
  }

  /**
   * Initializes operation state before an API call.
   */
  protected startOperation(): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._successMsg.set(null);
  }

  /**
   * Marks the current operation as finished.
   */
  protected finishOperation(): void {
    this._isLoading.set(false);
  }

  /**
   * Stores a user-facing error message and marks the operation as finished.
   *
   * @param error - Error value emitted by the failed operation
   * @param fallbackKey - Translation key used when the error is not a business rule violation
   */
  protected failOperation(error: unknown, fallbackKey: string): void {
    if (error instanceof BusinessError) {
      this._error.set(error.appMessage);
    } else {
      this._error.set({
        key: fallbackKey,
        params: { detail: error instanceof Error ? error.message : '' },
      });
    }
    this._isLoading.set(false);
  }

  /**
   * Publishes a success message without running an operation.
   *
   * @param message - Success message shown to the user
   */
  protected publishSuccess(message: AppMessage): void {
    this._successMsg.set(message);
  }
}
