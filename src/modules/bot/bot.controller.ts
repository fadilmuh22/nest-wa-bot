import { Controller, Get, Res, Post, Body } from '@nestjs/common';
import { BotService } from './bot.service';
import * as QRCode from 'qrcode';
import { Response } from 'express';
import { OnEvent } from '@nestjs/event-emitter';
import { Message } from 'whatsapp-web.js';

export class SendMessageDto {
  target: string;
  message: string;
}

@Controller()
export class BotController {
  private qrCode: string;
  constructor(private botService: BotService) {}

  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(qrCode: string) {
    this.qrCode = qrCode;
  }

  @Get('qrcode')
  async getQrCode(@Res() response: Response) {
    if (!this.qrCode) {
      return response.status(404).send('QR code not found');
    }

    response.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(response, this.qrCode);
  }

  @Post('send-message')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Res() response: Response<Message>,
  ) {
    return response
      .status(200)
      .send(
        await this.botService.sendMessage(
          sendMessageDto.target,
          sendMessageDto.message,
        ),
      );
  }
}
