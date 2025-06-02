import { Controller, Inject, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { WebhookAdapter } from './adapters/webhook.adapter';

@Controller('webhook')
export class WebhookController {
  constructor(
    @Inject('WebhookAdapter')
    private readonly webhookAdapter: WebhookAdapter,
  ) {}

  @Post()
  async handle(@Req() req: FastifyRequest) {
    const rawBody = (req as any).rawBody;
    await this.webhookAdapter.handleWebhook(req, rawBody);
  }
}
