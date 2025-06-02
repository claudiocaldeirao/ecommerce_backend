import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { WebhookAdapter } from './adapters/webhook.adapter';

@Controller('webhook')
export class WebhookController {
  constructor(
    @Inject('WebhookAdapter')
    private readonly webhookAdapter: WebhookAdapter,
  ) {}

  @Post()
  async handle(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const rawBody = (req as any).rawBody;
    await this.webhookAdapter.handleWebhook(req, res, rawBody);
  }
}
