import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './modules/bot/bot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModulesController } from './modules/modules.controller';

@Module({
  imports: [BotModule, EventEmitterModule.forRoot()],
  controllers: [AppController, ModulesController],
  providers: [AppService],
})
export class AppModule {}
