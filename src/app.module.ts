import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouponsModule } from './resources/coupons/coupons.module';
import { EventsModule } from './resources/events/events.module';
import { OwnersModule } from './resources/owners/owners.module';
import { UsersModule } from './resources/users/users.module';
import { SessionsModule } from './resources/sessions/sessions.module';


@Module({
  imports: [CouponsModule, EventsModule, OwnersModule, UsersModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
