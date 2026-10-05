import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Payment } from '../domain/model/payment.entity';
import { PaymentResource, PaymentsResponse } from './payment-response';

/**
 * Assembler for converting between Payment domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class PaymentAssembler implements BaseAssembler<
  Payment,
  PaymentResource,
  PaymentsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of Payment domain entities
   */
  toEntitiesFromResponse(response: PaymentsResponse): Payment[] {
    return response.payments.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns Payment domain entity
   */
  toEntityFromResource(resource: PaymentResource): Payment {
    return new Payment({
      id: resource.id,
      subscriptionId: resource.subscriptionId,
      amount: resource.amount,
      currency: resource.currency,
      status: resource.status,
      cardLast4: resource.cardLast4,
      paidAt: resource.paidAt,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - Payment domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: Payment): PaymentResource {
    return {
      id: entity.id,
      subscriptionId: entity.subscriptionId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      cardLast4: entity.cardLast4,
      paidAt: entity.paidAt,
    };
  }
}
