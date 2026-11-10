/**
 * Request payload to send a contact request (POST /contact-requests).
 */
export interface SubmitContactRequest {
  fullName: string;

  email: string;

  company: string;

  message: string;
}
