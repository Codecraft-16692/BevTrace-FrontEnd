/**
 * Test card number that the simulated payment gateway declines.
 */
export const DECLINED_TEST_CARD = '4000000000000002';

/**
 * Domain policy that validates card numbers before the simulated payment.
 *
 * @remarks
 * The card number is only validated and never persisted: the payment keeps the
 * last four digits. Validation uses the length and the Luhn checksum.
 */
export class CardPolicy {
  /**
   * Removes spaces and dashes from a card number.
   *
   * @param value - Card number typed by the user
   * @returns Card number with digits only
   */
  static normalize(value: string): string {
    return value.replace(/[\s-]/g, '');
  }

  /**
   * Validates a card number with its length and the Luhn checksum.
   *
   * @param value - Card number typed by the user
   * @returns True when the number has 16 digits and passes the checksum
   */
  static isValid(value: string): boolean {
    const digits = CardPolicy.normalize(value);
    if (!/^[0-9]{16}$/.test(digits)) return false;

    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let digit = Number(digits[digits.length - 1 - i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }

  /**
   * Extracts the last four digits of a card number.
   *
   * @param value - Card number typed by the user
   * @returns Last four digits
   */
  static last4(value: string): string {
    return CardPolicy.normalize(value).slice(-4);
  }
}
