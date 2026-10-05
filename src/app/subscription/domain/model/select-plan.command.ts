/**
 * Command for selecting a subscription plan.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SelectPlanCommand {
  /**
   * The code of the selected plan.
   */
  planCode: string;

  /**
   * The selected billing cycle.
   */
  billingCycle: 'MONTHLY' | 'YEARLY';
}
