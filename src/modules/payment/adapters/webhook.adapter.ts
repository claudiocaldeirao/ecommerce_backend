// webhook.adapter.ts
import { FastifyRequest } from 'fastify';

export interface WebhookAdapter {
  handleWebhook(request: FastifyRequest, rawBody: string): Promise<void>;
}
