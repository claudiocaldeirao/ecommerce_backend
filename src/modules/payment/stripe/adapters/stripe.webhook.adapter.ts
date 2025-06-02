import { Injectable } from '@nestjs/common';
import { WebhookAdapter } from '../../adapters/webhook.adapter';
import { FastifyRequest } from 'fastify';

@Injectable()
export class StripeWebhookAdapter implements WebhookAdapter {
  async handleWebhook(request: FastifyRequest, rawBody: string): Promise<void> {
    console.log('@todo: Raw webhook body:', rawBody);
  }
}
