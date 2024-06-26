import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouponsModule } from './resources/coupons/coupons.module';


@Module({
  imports: [CouponsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
