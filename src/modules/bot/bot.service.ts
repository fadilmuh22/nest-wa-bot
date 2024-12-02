import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Client,
  LocalAuth,
  Message,
  MessageContent,
  MessageSendOptions,
} from 'whatsapp-web.js';

@Injectable()
export class BotService implements OnModuleInit {
  private client: Client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });
  private readonly logger = new Logger(BotService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.client.on('qr', (qr) => {
      this.logger.log(`QrCode: http://localhost:${3000}/bot/qrcode`);
      this.eventEmitter.emit('qrcode.created', qr);
    });

    this.client.on('ready', () => {
      this.logger.log("You're connected successfully!");
    });

    this.client.on('message', (msg) => {
      this.logger.verbose(`${msg.from}: ${msg.body}`);
      if (msg.body == '!ping') {
        msg.reply('pong');
      }
    });

    this.client.initialize();
  }

  isValidPhoneNumber(target: string) {
    const phoneRe =
      /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
    const digits = target.replace(/\D/g, '');
    return phoneRe.test(digits);
  }

  toChatId(target: string) {
    if (this.isValidPhoneNumber(target)) {
      return target.replace(/\D/g, '') + '@c.us';
    }

    return target + 'g.us';
  }

  sendMessage(
    target: string,
    message: string,
    options?: MessageSendOptions,
  ): Promise<Message> {
    const chatId = this.toChatId(target);
    const content: MessageContent = message;
    return this.client.sendMessage(chatId, content, options);
  }
}
