/**
 * Request payload for creating a commercial contact request.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateContactRequestRequest {
  /**
   * The full name of the visitor.
   */
  fullName: string;

  /**
   * The contact e-mail.
   */
  email: string;

  /**
   * The company of the visitor.
   */
  company: string;

  /**
   * The message sent.
   */
  message: string;

  /**
   * The ISO 8601 timestamp of the request.
   */
  createdAt: string;
}
