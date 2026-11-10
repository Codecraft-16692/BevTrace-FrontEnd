/**
 * Request payload to subscribe to a plan (POST /subscriptions).
 *
 * @remarks
 * The user comes from the token. The backend validates the card, charges the
 * payment and stores only the last four digits.
 */
export interface SubscribeRequest {
  companyName: string;

  planCode: string;

  billingCycle: 'MONTHLY' | 'YEARLY';

  cardHolder: string;

  cardNumber: string;
}
