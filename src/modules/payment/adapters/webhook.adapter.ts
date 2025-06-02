// webhook.adapter.ts
import { FastifyReply, FastifyRequest } from 'fastify';

export interface WebhookAdapter {
  handleWebhook(
    request: FastifyRequest,
    response: FastifyReply,
    rawBody: string,
  ): Promise<void>;
}
