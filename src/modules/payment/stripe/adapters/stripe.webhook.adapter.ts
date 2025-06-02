import { Injectable } from '@nestjs/common';
import { WebhookAdapter } from '../../adapters/webhook.adapter';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class StripeWebhookAdapter implements WebhookAdapter {
  async handleWebhook(
    request: FastifyRequest,
    response: FastifyReply,
    rawBody: string,
  ): Promise<void> {
    console.log('@todo: Raw webhook body:', rawBody);
    response.send({ received: true });
  }
}
